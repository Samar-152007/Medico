// MEDICO Backend API Service
// This connects to your Flask backend running on ngrok/localhost

export interface Symptom {
  text: string;
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: string;
}

export interface DiagnosisResult {
  disease: string;
  confidence: number;
  matchedSymptoms: string[];
}

export interface ApiResponse {
  message: string;
  predictions?: DiagnosisResult[];
  followUpQuestion?: string;
  isEmergency?: boolean;
}

// Configure your Flask backend URL here
const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  (import.meta as any).env?.VITE_API_URL ||
  'http://localhost:5000';

// Set to true to use mock data (for development without backend)
// Set to false when your Flask backend is ready
const USE_MOCK_DATA = true;

class MedicoApiService {
  private language: 'en' | 'hi' | 'mr' = 'en';
  private conversationId: string = '';

  setLanguage(lang: 'en' | 'hi' | 'mr') {
    this.language = lang;
  }

  // Initialize conversation with backend
  async startConversation(language: 'en' | 'hi' | 'mr'): Promise<ApiResponse> {
    this.language = language;
    this.conversationId = `conv_${Date.now()}`;
    
    // Use mock data if enabled or if backend fails
    if (USE_MOCK_DATA) {
      return Promise.resolve(this.getMockStartResponse());
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${API_BASE_URL}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: this.conversationId,
          language: language,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }

      return await response.json();
    } catch (error) {
      // Silently fall back to mock data
      return this.getMockStartResponse();
    }
  }

  // Send symptom to backend
  async sendSymptom(symptomText: string, severity?: string, duration?: string): Promise<ApiResponse> {
    // Use mock data if enabled or if backend fails
    if (USE_MOCK_DATA) {
      return Promise.resolve(this.getMockSymptomResponse(symptomText));
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/symptom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: this.conversationId,
          language: this.language,
          symptom: symptomText,
          severity,
          duration,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to send symptom');
      }

      return await response.json();
    } catch (error) {
      return this.getMockSymptomResponse(symptomText);
    }
  }

  // Get diagnosis from backend
  async getDiagnosis(symptoms: Symptom[]): Promise<ApiResponse> {
    // Use mock data if enabled or if backend fails
    if (USE_MOCK_DATA) {
      return Promise.resolve(this.getMockDiagnosisResponse(symptoms));
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: this.conversationId,
          language: this.language,
          symptoms,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to get diagnosis');
      }

      return await response.json();
    } catch (error) {
      return this.getMockDiagnosisResponse(symptoms);
    }
  }

  // Mock responses for development (when Flask backend is not running)
  private getMockStartResponse(): ApiResponse {
    const greetings = {
      en: "Hello! I'm MEDICO 👨‍⚕️ Your AI health assistant. Tell me what symptoms you're experiencing.",
      hi: "नमस्ते! मैं MEDICO हूं 👨‍⚕️ आपका AI स्वास्थ्य सहायक। आपको क्या लक्षण महसूस हो रहे हैं?",
      mr: "नमस्कार! मी MEDICO आहे 👨‍⚕️ तुमचा AI आरोग्य सहाय्यक। तुम्हाला कोणती लक्षणे जाणवत आहेत?"
    };

    return {
      message: greetings[this.language],
      followUpQuestion: undefined,
    };
  }

  private getMockSymptomResponse(symptom: string): ApiResponse {
    const responses = {
      en: [
        "I understand. How long have you been experiencing this?",
        "Got it. How severe is this symptom - mild, moderate, or severe?",
        "Noted. Any other symptoms? Type 'done' when you've listed everything.",
      ],
      hi: [
        "समझ गया। यह लक्षण कब से है?",
        "ठीक है। यह लक्षण कितना गंभीर है - हल्का, मध्यम या गंभीर?",
        "नोट किया। कोई और लक्षण? सब बताने के बाद 'done' टाइप करें।",
      ],
      mr: [
        "समजले। हे लक्षण किती दिवसांपासून आहे?",
        "ठीक आहे। हे लक्षण किती तीव्र आहे - सौम्य, मध्यम किंवा तीव्र?",
        "नोंद घेतली। आणखी काही लक्षणे? सर्व सांगितल्यानंतर 'done' टाइप करा।",
      ],
    };

    const randomResponse = responses[this.language][Math.floor(Math.random() * responses[this.language].length)];
    
    // Check for emergency keywords
    const emergencyKeywords = ['severe', 'chest pain', 'bleeding', 'unconscious', 'difficulty breathing', 
                               "can't breathe", 'severe bleeding', 'heart attack', 'stroke',
                               'सीने में दर्द', 'खून', 'बेहोश', 'सांस लेने में तकलीफ',
                               'छातीत दुखणे', 'रक्तस्राव', 'बेशुद्ध', 'श्वास घेण्यात अडचण'];
    
    const isEmergency = emergencyKeywords.some(keyword => 
      symptom.toLowerCase().includes(keyword.toLowerCase())
    );

    return {
      message: randomResponse,
      isEmergency,
    };
  }

  private getMockDiagnosisResponse(symptoms: Symptom[]): ApiResponse {
    // Intelligent disease prediction based on symptoms
    const symptomTexts = symptoms.map(s => s.text.toLowerCase()).join(' ');
    
    const predictions: DiagnosisResult[] = [];

    // Dengue detection - requires multiple specific symptoms
    const dengueSymptoms = ['fever', 'high fever', 'joint pain', 'body pain', 'muscle pain', 'headache', 'rash', 'nausea', 'vomiting', 'eye pain', 'fatigue'];
    const dengueMatches = dengueSymptoms.filter(ds => symptomTexts.includes(ds));
    if (dengueMatches.length >= 3 && symptomTexts.includes('fever')) {
      predictions.push({
        disease: 'Dengue Fever',
        confidence: Math.min(85, 45 + (dengueMatches.length * 8)),
        matchedSymptoms: dengueMatches,
      });
    }

    // Malaria detection
    const malariaSymptoms = ['fever', 'chills', 'sweating', 'shivering', 'headache', 'nausea', 'vomiting', 'fatigue', 'muscle pain'];
    const malariaMatches = malariaSymptoms.filter(ms => symptomTexts.includes(ms));
    if (malariaMatches.length >= 3 && (symptomTexts.includes('fever') || symptomTexts.includes('chills'))) {
      predictions.push({
        disease: 'Malaria',
        confidence: Math.min(80, 40 + (malariaMatches.length * 8)),
        matchedSymptoms: malariaMatches,
      });
    }

    // Typhoid detection
    const typhoidSymptoms = ['fever', 'prolonged fever', 'weakness', 'stomach pain', 'abdominal pain', 'headache', 'loss of appetite', 'fatigue'];
    const typhoidMatches = typhoidSymptoms.filter(ts => symptomTexts.includes(ts));
    if (typhoidMatches.length >= 2 && symptomTexts.includes('fever')) {
      predictions.push({
        disease: 'Typhoid Fever',
        confidence: Math.min(75, 35 + (typhoidMatches.length * 10)),
        matchedSymptoms: typhoidMatches,
      });
    }

    // Viral Fever detection - more common, lower threshold
    const viralSymptoms = ['fever', 'cough', 'cold', 'runny nose', 'sore throat', 'headache', 'fatigue', 'body pain', 'weakness'];
    const viralMatches = viralSymptoms.filter(vs => symptomTexts.includes(vs));
    if (viralMatches.length >= 2) {
      predictions.push({
        disease: 'Viral Fever',
        confidence: Math.min(70, 35 + (viralMatches.length * 8)),
        matchedSymptoms: viralMatches,
      });
    }

    // Common Cold/Flu
    const coldSymptoms = ['runny nose', 'sneezing', 'cough', 'mild fever', 'sore throat', 'congestion', 'cold'];
    const coldMatches = coldSymptoms.filter(cs => symptomTexts.includes(cs));
    if (coldMatches.length >= 2) {
      predictions.push({
        disease: 'Common Cold',
        confidence: Math.min(65, 30 + (coldMatches.length * 10)),
        matchedSymptoms: coldMatches,
      });
    }

    // Migraine detection
    const migraineSymptoms = ['headache', 'severe headache', 'nausea', 'vomiting', 'sensitivity to light', 'dizziness'];
    const migraineMatches = migraineSymptoms.filter(ms => symptomTexts.includes(ms));
    if (migraineMatches.length >= 2 && symptomTexts.includes('headache')) {
      predictions.push({
        disease: 'Migraine',
        confidence: Math.min(70, 40 + (migraineMatches.length * 10)),
        matchedSymptoms: migraineMatches,
      });
    }

    // Gastroenteritis detection
    const gastroSymptoms = ['vomiting', 'nausea', 'diarrhea', 'stomach pain', 'abdominal pain', 'cramps', 'fever'];
    const gastroMatches = gastroSymptoms.filter(gs => symptomTexts.includes(gs));
    if (gastroMatches.length >= 2) {
      predictions.push({
        disease: 'Gastroenteritis',
        confidence: Math.min(68, 35 + (gastroMatches.length * 10)),
        matchedSymptoms: gastroMatches,
      });
    }

    // Sort by confidence
    predictions.sort((a, b) => b.confidence - a.confidence);

    // Take top 3
    const topPredictions = predictions.slice(0, 3);

    const messages = {
      en: "Based on your symptoms, here are the possible conditions:",
      hi: "आपके लक्षणों के आधार पर, ये संभावित स्थितियां हैं:",
      mr: "तुमच्या लक्षणांच्या आधारे, या संभाव्य स्थिती आहेत:"
    };

    return {
      message: messages[this.language],
      predictions: topPredictions.length > 0 ? topPredictions : [
        {
          disease: this.language === 'en' ? 'General Malaise' : this.language === 'hi' ? 'सामान्य अस्वस्थता' : 'सामान्य अस्वस्थता',
          confidence: 30,
          matchedSymptoms: symptoms.map(s => s.text).slice(0, 2),
        }
      ],
    };
  }
}

export const medicoApi = new MedicoApiService();