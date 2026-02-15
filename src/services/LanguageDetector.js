import { franc } from 'franc';
import { SUPPORTED_LANGUAGES } from '../config/languages.js';

export class LanguageDetector {
  detectLanguage(text) {
    const detected = franc(text, { minLength: 3 });
    
    const langMap = {
      'eng': 'en',
      'kan': 'kn',
      'hin': 'hi',
      'tam': 'ta',
      'tel': 'te',
      'mal': 'ml',
      'mar': 'mr',
      'ben': 'bn',
      'guj': 'gu'
    };

    const language = langMap[detected] || 'en';
    const confidence = detected !== 'und' ? 0.8 : 0.5;

    return {
      language,
      confidence,
      supportedLanguages: SUPPORTED_LANGUAGES
    };
  }

  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }
}
