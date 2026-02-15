import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS input_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        input_text TEXT NOT NULL,
        input_language VARCHAR(5) NOT NULL,
        detected_language VARCHAR(5),
        language_confidence FLOAT,
        input_type VARCHAR(20),
        difficulty_level VARCHAR(20),
        output_language VARCHAR(5),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS explanations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        request_id UUID REFERENCES input_requests(id),
        topic TEXT NOT NULL,
        difficulty_level VARCHAR(20),
        output_language VARCHAR(5),
        core_concepts JSONB,
        prerequisites JSONB,
        key_terms JSONB,
        explanation_text TEXT,
        examples JSONB,
        summary TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS teaching_scripts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        explanation_id UUID REFERENCES explanations(id),
        script_data JSONB,
        total_scenes INTEGER,
        estimated_duration INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Database initialized successfully');
  } finally {
    client.release();
  }
};
