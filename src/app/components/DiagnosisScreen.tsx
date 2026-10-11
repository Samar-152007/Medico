import { CheckCircle, AlertCircle, Home, FileText } from "lucide-react";
import { Symptom, DiagnosisResult } from "../services/medicApi";
import type { NavigateFn, NavState } from "../App";

interface Props {
  navigate: NavigateFn;
  locationState: NavState;
}

export function DiagnosisScreen({ navigate, locationState }: Props) {
  const symptoms = (locationState?.symptoms as Symptom[]) || [];
  const predictions = (locationState?.predictions as DiagnosisResult[]) || [];
  const language = locationState?.language || "en";

  const translations = {
    en: {
      title: "Analysis Complete",
      subtitle: "Based on your symptoms",
      symptomsTitle: "Your Symptoms",
      conditionsTitle: "Possible Conditions",
      actionsTitle: "Recommended Actions",
      actions: [
        "Drink plenty of fluids to stay hydrated",
        "Get adequate rest and sleep",
        "Consult a doctor for proper diagnosis",
        "Monitor your symptoms closely",
      ],
      emergencyBtn: "Report Emergency",
      homeBtn: "Back to Home",
      disclaimer: "This is an AI-generated assessment and not a medical diagnosis. Please consult with a qualified healthcare professional.",
      severity: "Severity",
      duration: "Duration",
      confidence: "Confidence",
    },
    hi: {
      title: "विश्लेषण पूर्ण",
      subtitle: "आपके लक्षणों के आधार पर",
      symptomsTitle: "आपके लक्षण",
      conditionsTitle: "संभावित स्थितियां",
      actionsTitle: "अनुशंसित कार्रवाई",
      actions: [
        "हाइड्रेटेड रहने के लिए पर्याप्त मात्रा में तरल पदार्थ पिएं",
        "पर्याप्त आराम और नींद लें",
        "उचित निदान के लिए डॉक्टर से परामर्श लें",
        "अपने लक्षणों की बारीकी से निगरानी करें",
      ],
      emergencyBtn: "आपातकालीन रिपोर्ट करें",
      homeBtn: "होम पर वापस जाएं",
      disclaimer: "यह एक AI-जनित मूल्यांकन है और चिकित्सा निदान नहीं है। कृपया एक योग्य स्वास्थ्य देखभाल पेशेवर से परामर्श लें।",
      severity: "गंभीरता",
      duration: "अवधि",
      confidence: "विश्वास",
    },
    mr: {
      title: "विश्लेषण पूर्ण",
      subtitle: "तुमच्या लक्षणांवर आधारित",
      symptomsTitle: "तुमची लक्षणे",
      conditionsTitle: "संभाव्य स्थिती",
      actionsTitle: "शिफारस केलेल्या कृती",
      actions: [
        "हायड्रेटेड राहण्यासाठी भरपूर द्रवपदार्थ प्या",
        "पुरेसा विश्रांती आणि झोप घ्या",
        "योग्य निदानासाठी डॉक्टरांचा सल्ला घ्या",
        "तुमच्या लक्षणांचे बारकाईने निरीक्षण करा",
      ],
      emergencyBtn: "आपत्कालीन अहवाल द्या",
      homeBtn: "मुख्यपृष्ठावर परत जा",
      disclaimer: "हे एक AI-व्युत्पन्न मूल्यांकन आहे आणि वैद्यकीय निदान नाही. कृपया पात्र आरोग्य सेवा व्यावसायिकांशी सल्लामसलत करा।",
      severity: "तीव्रता",
      duration: "कालावधी",
      confidence: "आत्मविश्वास",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const getConfidenceColor = (c: number) => c >= 70 ? "text-red-600" : c >= 50 ? "text-orange-500" : "text-yellow-600";
  const getConfidenceBgColor = (c: number) => c >= 70 ? "bg-red-100" : c >= 50 ? "bg-orange-100" : "bg-yellow-100";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">{t.title}</h2>
        <p className="text-gray-600 text-center mb-8">{t.subtitle}</p>

        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {t.symptomsTitle}
          </h3>
          <div className="space-y-2">
            {symptoms.map((symptom, index) => (
              <div key={index} className="bg-blue-50 text-blue-900 px-3 py-2 rounded-lg">
                <div className="font-medium">{symptom.text}</div>
                {(symptom.severity || symptom.duration) && (
                  <div className="text-xs text-blue-700 mt-1 flex gap-3">
                    {symptom.severity && (
                      <span>{t.severity}: <span className="font-medium capitalize">{symptom.severity}</span></span>
                    )}
                    {symptom.duration && (
                      <span>{t.duration}: <span className="font-medium">{symptom.duration}</span></span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            {t.conditionsTitle}
          </h3>
          <div className="space-y-3">
            {predictions.length > 0 ? (
              predictions.map((prediction, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    index === 0 ? "border-red-200 bg-red-50" :
                    index === 1 ? "border-orange-200 bg-orange-50" :
                    "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-semibold text-gray-800 text-lg">
                        {index + 1}. {prediction.disease}
                      </span>
                      {prediction.matchedSymptoms && prediction.matchedSymptoms.length > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          Matched: {prediction.matchedSymptoms.length} symptoms
                        </div>
                      )}
                    </div>
                    <div className={`${getConfidenceBgColor(prediction.confidence)} px-3 py-1 rounded-full`}>
                      <span className={`text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                        {prediction.confidence}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        prediction.confidence >= 70 ? "bg-red-500" :
                        prediction.confidence >= 50 ? "bg-orange-500" :
                        "bg-yellow-500"
                      }`}
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Not enough information to make a prediction.</p>
                <p className="text-sm mt-1">Please provide more detailed symptoms.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-green-900 mb-3">{t.actionsTitle}</h3>
          <ul className="space-y-2 text-green-800">
            {t.actions.map((action, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/emergency", { language })}
            className="w-full bg-red-600 text-white py-4 rounded-full shadow-lg hover:bg-red-700 transition-colors font-semibold"
          >
            {t.emergencyBtn}
          </button>
          <button
            onClick={() => navigate("/welcome")}
            className="w-full bg-blue-600 text-white py-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            {t.homeBtn}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">{t.disclaimer}</p>
      </div>
    </div>
  );
}
