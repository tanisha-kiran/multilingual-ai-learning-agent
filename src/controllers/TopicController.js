import { pool } from '../config/database.js';
import { LanguageDetector } from '../services/LanguageDetector.js';
import { ContentModerator } from '../services/ContentModerator.js';
import { AITeachingEngine } from '../services/AITeachingEngine.js';

export class TopicController {
  constructor() {
    this.languageDetector = new LanguageDetector();
    this.moderator = new ContentModerator();
    this.teachingEngine = new AITeachingEngine();
  }

  async processTopicRequest(req, res) {
    try {
      const { topic, difficulty = 'beginner', outputLanguage } = req.body;

      if (!topic || topic.length < 10) {
        return res.status(400).json({ error: 'Topic must be at least 10 characters' });
      }

      const moderation = this.moderator.moderateContent(topic);
      if (!moderation.approved) {
        return res.status(400).json({ error: moderation.reason });
      }

      const detection = this.languageDetector.detectLanguage(topic);
      
      const client = await pool.connect();
      try {
        const requestResult = await client.query(
          `INSERT INTO input_requests 
           (input_text, input_language, detected_language, language_confidence, 
            input_type, difficulty_level, output_language, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [topic, detection.language, detection.language, detection.confidence,
           'topic', difficulty, outputLanguage || detection.language, 'processing']
        );

        const request = requestResult.rows[0];
        
        const result = await this.teachingEngine.processTopicRequest({
          id: request.id,
          input_text: topic,
          input_language: detection.language,
          difficulty_level: difficulty,
          output_language: outputLanguage || detection.language
        });

        const explanationResult = await client.query(
          `INSERT INTO explanations 
           (request_id, topic, difficulty_level, output_language, 
            core_concepts, prerequisites, key_terms, explanation_text, examples)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [request.id, topic, difficulty, outputLanguage || detection.language,
           JSON.stringify(result.analysis.coreConcepts),
           JSON.stringify(result.analysis.prerequisites),
           JSON.stringify(result.analysis.keyTerms),
           result.explanation,
           JSON.stringify(result.examples)]
        );

        const explanation = explanationResult.rows[0];

        const scriptResult = await client.query(
          `INSERT INTO teaching_scripts 
           (explanation_id, script_data, total_scenes, estimated_duration)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [explanation.id, JSON.stringify(result.script), result.script.length,
           result.script.reduce((sum, s) => sum + s.duration, 0)]
        );

        await client.query(
          `UPDATE input_requests SET status = $1, updated_at = NOW() WHERE id = $2`,
          ['completed', request.id]
        );

        res.json({
          requestId: request.id,
          explanation: explanation,
          script: scriptResult.rows[0],
          detectedLanguage: detection.language
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error processing topic:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getLanguages(req, res) {
    const languages = this.languageDetector.getSupportedLanguages();
    res.json({ languages });
  }
}
