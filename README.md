# Multilingual AI Learning Agent with Anime Video Explainer

An AI-powered educational platform that generates personalized explanations and anime-style video scripts in multiple Indian languages.

## Features

- **Multilingual Support**: English, Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati
- **Auto Language Detection**: Automatically detects input language
- **Difficulty Levels**: Beginner, Exam-Ready, Deep Concept
- **AI-Powered Explanations**: Generates clear, culturally relevant explanations
- **Video Script Generation**: Creates anime-style teaching scripts with scene descriptions
- **Content Moderation**: Ensures educational and appropriate content

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database and create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/learning_agent
OPENAI_API_KEY=your_key_here
GOOGLE_CLOUD_API_KEY=your_key_here
```

4. Start the server:
```bash
npm start
```

5. Open browser at `http://localhost:3000`

## API Endpoints

### POST /api/topic/process
Generate explanation for a topic
```json
{
  "topic": "Explain photosynthesis",
  "difficulty": "beginner",
  "outputLanguage": "hi"
}
```

### GET /api/languages
Get list of supported languages

## Architecture

- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Frontend**: Vanilla JavaScript
- **AI Services**: OpenAI API (configurable)

## Project Structure

```
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── languages.js
│   ├── controllers/
│   │   └── TopicController.js
│   ├── services/
│   │   ├── LanguageDetector.js
│   │   ├── ContentModerator.js
│   │   └── AITeachingEngine.js
│   ├── routes/
│   │   └── api.js
│   └── server.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── package.json
```

## Future Enhancements

- Video generation with FFmpeg
- Text-to-speech narration
- Document translation
- User authentication
- Video storage and streaming
