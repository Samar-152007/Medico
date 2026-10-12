import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Bot } from "lucide-react";
import { medicoApi, Symptom } from "../services/medicApi";
import type { NavigateFn, NavState } from "../App";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ConversationState {
  awaitingSeverity: boolean;
  awaitingDuration: boolean;
  currentSymptom: string;
}

interface Props {
  navigate: NavigateFn;
  locationState: NavState;
}

export function ChatbotScreen({ navigate, locationState }: Props) {
  const selectedLanguage: "en" | "hi" | "mr" =
    locationState?.language === "hi" || locationState?.language === "mr"
      ? locationState.language
      : "en";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [userSymptoms, setUserSymptoms] = useState<Symptom[]>([]);
  const [conversationState, setConversationState] = useState<ConversationState>({
    awaitingSeverity: false,
    awaitingDuration: false,
    currentSymptom: "",
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const symptomSuggestions = {
    en: ["Fever", "Headache", "Cough", "Vomiting", "Body pain", "Fatigue", "Sore throat"],
    hi: ["बुखार", "सिरदर्द", "खांसी", "उल्टी", "शरीर में दर्द", "थकान", "गले में खराश"],
    mr: ["ताप", "डोकेदुखी", "खोकला", "उलट्या", "शरीर दुखी", "थकवा", "घसा खवखवणे"],
  };

  const translations = {
    en: {
      placeholder: "Type your symptoms...",
      done: "done",
      severityPrompt: "How severe? (mild/moderate/severe)",
      durationPrompt: "How long? (e.g., 2 days, 1 week)",
      quickSuggestions: "Quick suggestions:",
    },
    hi: {
      placeholder: "अपने लक्षण लिखें...",
      done: "पूर्ण",
      severityPrompt: "कितना गंभीर? (हल्का/मध्यम/गंभीर)",
      durationPrompt: "कब से? (जैसे, 2 दिन, 1 सप्ताह)",
      quickSuggestions: "त्वरित सुझाव:",
    },
    mr: {
      placeholder: "तुमची लक्षणे लिहा...",
      done: "पूर्ण",
      severityPrompt: "किती तीव्र? (सौम्य/मध्यम/तीव्र)",
      durationPrompt: "किती दिवसांपासून? (उदा., 2 दिवस, 1 आठवडा)",
      quickSuggestions: "जलद सूचना:",
    },
  };

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  useEffect(() => {
    medicoApi.setLanguage(selectedLanguage);
    medicoApi.startConversation(selectedLanguage).then((response) => {
      setMessages([{ id: 1, text: response.message, sender: "bot", timestamp: new Date() }]);
    });
  }, [selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text, sender: "bot", timestamp: new Date() },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: messageText, sender: "user", timestamp: new Date() },
    ]);
    setInputText("");

    if (conversationState.awaitingSeverity) {
      const updated = [...userSymptoms];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        severity: messageText.toLowerCase() as "mild" | "moderate" | "severe",
      };
      setUserSymptoms(updated);
      setConversationState({ awaitingSeverity: false, awaitingDuration: true, currentSymptom: conversationState.currentSymptom });
      addBotMessage(t.durationPrompt);
      return;
    }

    if (conversationState.awaitingDuration) {
      const updated = [...userSymptoms];
      updated[updated.length - 1] = { ...updated[updated.length - 1], duration: messageText };
      setUserSymptoms(updated);
      setConversationState({ awaitingSeverity: false, awaitingDuration: false, currentSymptom: "" });
      const responses = {
        en: `Got it. Any other symptoms? Type '${t.done}' when finished.`,
        hi: "समझ गया। कोई और लक्षण? सब बताने के बाद 'पूर्ण' टाइप करें।",
        mr: "समजले। आणखी काही लक्षणे? सर्व सांगितल्यानंतर 'पूर्ण' टाइप करा।",
      };
      addBotMessage(responses[selectedLanguage as keyof typeof responses] || responses.en);
      return;
    }

    const emergencyKeywords = [
      "severe chest pain", "chest pain", "bleeding", "unconscious", "difficulty breathing",
      "can't breathe", "severe bleeding", "heart attack", "stroke",
      "सीने में दर्द", "खून", "बेहोश", "सांस लेने में तकलीफ",
      "छातीत दुखणे", "रक्तस्राव", "बेशुद्ध", "श्वास घेण्यात अडचण",
    ];

    const isEmergency = emergencyKeywords.some((kw) =>
      messageText.toLowerCase().includes(kw.toLowerCase())
    );

    if (isEmergency) {
      const msgs = {
        en: "⚠️ This sounds like an emergency! Redirecting to emergency assistance...",
        hi: "⚠️ यह आपातकालीन स्थिति लगती है! आपातकालीन सहायता की ओर रीडायरेक्ट कर रहे हैं...",
        mr: "⚠️ ही आपत्कालीन परिस्थिती दिसते! आपत्कालीन मदतीकडे पुनर्निर्देशित करत आहे...",
      };
      addBotMessage(msgs[selectedLanguage as keyof typeof msgs] || msgs.en);
      setTimeout(() => navigate("/emergency", { language: selectedLanguage }), 2000);
      return;
    }

    if (messageText.toLowerCase() === t.done.toLowerCase() || messageText.toLowerCase() === "done") {
      if (userSymptoms.length === 0) {
        const noSymptomsMsgs = {
          en: "You haven't mentioned any symptoms yet. Please describe what you're experiencing.",
          hi: "आपने अभी तक कोई लक्षण नहीं बताया। कृपया बताएं कि आप क्या महसूस कर रहे हैं।",
          mr: "तुम्ही अद्याप कोणतीही लक्षणे सांगितलेली नाहीत. कृपया तुम्हाला काय जाणवत आहे ते सांगा।",
        };
        addBotMessage(noSymptomsMsgs[selectedLanguage as keyof typeof noSymptomsMsgs] || noSymptomsMsgs.en);
        return;
      }
      const analyzingMsgs = {
        en: "🔍 Analyzing your symptoms... Please wait.",
        hi: "🔍 आपके लक्षणों का विश्लेषण कर रहे हैं... कृपया प्रतीक्षा करें।",
        mr: "🔍 तुमच्या लक्षणांचे विश्लेषण करत आहे... कृपया प्रतीक्षा करा।",
      };
      addBotMessage(analyzingMsgs[selectedLanguage as keyof typeof analyzingMsgs] || analyzingMsgs.en);
      setTimeout(async () => {
        const diagnosis = await medicoApi.getDiagnosis(userSymptoms);
        navigate("/diagnosis", { symptoms: userSymptoms, predictions: diagnosis.predictions, language: selectedLanguage });
      }, 2500);
      return;
    }

    const newSymptom: Symptom = { text: messageText };
    setUserSymptoms((prev) => [...prev, newSymptom]);

    const response = await medicoApi.sendSymptom(messageText);

    if (response.isEmergency) {
      const msgs = {
        en: "⚠️ This sounds like an emergency! Redirecting to emergency assistance...",
        hi: "⚠️ यह आपातकालीन स्थिति लगती है! आपातकालीन सहायता की ओर रीडायरेक्ट कर रहे हैं...",
        mr: "⚠️ ही आपत्कालीन परिस्थिती दिसते! आपत्कालीन मदतीकडे पुनर्निर्देशित करत आहे...",
      };
      addBotMessage(msgs[selectedLanguage as keyof typeof msgs] || msgs.en);
      setTimeout(() => navigate("/emergency", { language: selectedLanguage }), 2000);
      return;
    }

    setConversationState({ awaitingSeverity: true, awaitingDuration: false, currentSymptom: messageText });
    addBotMessage(t.severityPrompt);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-blue-600 text-white px-4 py-4 shadow-md flex items-center gap-3">
        <button onClick={() => navigate("/language")} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">MEDICO AI</h3>
            <p className="text-xs text-blue-100">{isTyping ? "Typing..." : "Online"}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              message.sender === "user"
                ? "bg-blue-600 text-white rounded-tr-sm"
                : "bg-white text-gray-800 rounded-tl-sm shadow-sm"
            }`}>
              <p className="whitespace-pre-wrap">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-400"}`}>
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {userSymptoms.length === 0 && !conversationState.awaitingSeverity && !conversationState.awaitingDuration && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">{t.quickSuggestions}</p>
          <div className="flex flex-wrap gap-2">
            {(symptomSuggestions[selectedLanguage as keyof typeof symptomSuggestions] || symptomSuggestions.en).map((symptom) => (
              <button
                key={symptom}
                onClick={() => handleSendMessage(symptom)}
                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm hover:bg-blue-100 transition-colors"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
      )}

      {conversationState.awaitingSeverity && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick select:</p>
          <div className="flex gap-2">
            {["Mild", "Moderate", "Severe"].map((severity) => (
              <button
                key={severity}
                onClick={() => handleSendMessage(severity)}
                className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm hover:bg-green-100 transition-colors flex-1"
              >
                {severity}
              </button>
            ))}
          </div>
        </div>
      )}

      {conversationState.awaitingDuration && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick select:</p>
          <div className="flex flex-wrap gap-2">
            {["1 day", "2 days", "3 days", "1 week", "2 weeks"].map((duration) => (
              <button
                key={duration}
                onClick={() => handleSendMessage(duration)}
                className="bg-purple-50 text-purple-700 px-3 py-2 rounded-full text-sm hover:bg-purple-100 transition-colors"
              >
                {duration}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={t.placeholder}
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputText.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {userSymptoms.length > 0 && !conversationState.awaitingSeverity && !conversationState.awaitingDuration && (
          <button
            onClick={() => handleSendMessage(t.done)}
            className="w-full mt-2 bg-green-600 text-white py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
          >
            ✓ {t.done.toUpperCase()} - Get Diagnosis
          </button>
        )}
      </div>
    </div>
  );
}
