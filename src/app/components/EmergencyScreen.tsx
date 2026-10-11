import { AlertTriangle, Phone, Home, MapPin } from "lucide-react";
import type { NavigateFn, NavState } from "../App";

interface Props {
  navigate: NavigateFn;
  locationState: NavState;
}

export function EmergencyScreen({ navigate, locationState }: Props) {
  const language = locationState?.language || "en";

  const translations = {
    en: {
      title: "⚠️ Medical Emergency Detected",
      subtitle: "Severe symptoms detected. Please contact a doctor immediately or call emergency services.",
      criticalTitle: "Critical Symptoms Identified",
      criticalText: "Your symptoms may require immediate medical attention. Do not delay seeking professional help.",
      actions: [
        "Call emergency services immediately",
        "Visit the nearest hospital",
        "Inform family members or friends",
      ],
      contactsTitle: "Emergency Contacts",
      contacts: [
        { service: "Ambulance", number: "108" },
        { service: "Emergency Helpline", number: "112" },
      ],
      findHospital: "Find Nearest Hospital",
      backHome: "Back to Home",
      disclaimer: "If you are experiencing a life-threatening emergency, call emergency services immediately. Do not wait.",
      mapMsg: "This would open your maps app to find nearby hospitals",
    },
    hi: {
      title: "⚠️ चिकित्सा आपातकाल का पता चला",
      subtitle: "गंभीर लक्षण पाए गए हैं। कृपया तुरंत डॉक्टर से संपर्क करें या आपातकालीन सेवाओं को कॉल करें।",
      criticalTitle: "गंभीर लक्षण पहचाने गए",
      criticalText: "आपके लक्षणों के लिए तत्काल चिकित्सा ध्यान की आवश्यकता हो सकती है। पेशेवर मदद लेने में देरी न करें।",
      actions: [
        "तुरंत आपातकालीन सेवाओं को कॉल करें",
        "निकटतम अस्पताल जाएं",
        "परिवार के सदस्यों या दोस्तों को सूचित करें",
      ],
      contactsTitle: "आपातकालीन संपर्क",
      contacts: [
        { service: "एम्बुलेंस", number: "108" },
        { service: "आपातकालीन हेल्पलाइन", number: "112" },
      ],
      findHospital: "निकटतम अस्पताल खोजें",
      backHome: "होम पर वापस जाएं",
      disclaimer: "यदि आप जीवन-घातक आपातकाल का अनुभव कर रहे हैं, तो तुरंत आपातकालीन सेवाओं को कॉल करें। प्रतीक्षा न करें।",
      mapMsg: "यह आपके मैप्स ऐप को निकटतम अस्पतालों को खोजने के लिए खोलेगा",
    },
    mr: {
      title: "⚠️ वैद्यकीय आपत्कालीन स्थिती आढळली",
      subtitle: "गंभीर लक्षणे आढळली आहेत. कृपया ताबडतोब डॉक्टरांशी संपर्क साधा किंवा आपत्कालीन सेवांना कॉल करा।",
      criticalTitle: "गंभीर लक्षणे ओळखली गेली",
      criticalText: "तुमच्या लक्षणांना त्वरित वैद्यकीय लक्ष आवश्यक असू शकते. व्यावसायिक मदत घेण्यास उशीर करू नका।",
      actions: [
        "ताबडतोब आपत्कालीन सेवांना कॉल करा",
        "जवळच्या रुग्णालयात जा",
        "कुटुंबातील सदस्य किंवा मित्रांना माहिती द्या",
      ],
      contactsTitle: "आपत्कालीन संपर्क",
      contacts: [
        { service: "रुग्णवाहिका", number: "108" },
        { service: "आपत्कालीन हेल्पलाइन", number: "112" },
      ],
      findHospital: "जवळचे रुग्णालय शोधा",
      backHome: "मुख्यपृष्ठावर परत जा",
      disclaimer: "जर तुम्ही जीवघेणी आपत्कालीन परिस्थिती अनुभवत असाल तर ताबडतोब आपत्कालीन सेवांना कॉल करा. थांबू नका।",
      mapMsg: "हे जवळच्या रुग्णालयांना शोधण्यासाठी तुमचा नकाशा अ‍ॅप उघडेल",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white px-6 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full animate-pulse">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>
        </div>

        <div className="bg-red-600 text-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-3 text-center">{t.title}</h2>
          <p className="text-center text-red-50">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-2 border-red-200">
          <h3 className="font-semibold text-red-900 mb-3">{t.criticalTitle}</h3>
          <p className="text-gray-700 mb-4">{t.criticalText}</p>
          <ul className="space-y-2 text-gray-700">
            {t.actions.map((action, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">{t.contactsTitle}</h3>
          <div className="space-y-3">
            {t.contacts.map((contact, index) => (
              <a
                key={index}
                href={`tel:${contact.number}`}
                className="flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 p-2 rounded-full">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{contact.service}</span>
                </div>
                <span className="text-xl font-bold text-red-600">{contact.number}</span>
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={() => alert(t.mapMsg)}
          className="w-full bg-blue-600 text-white py-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 mb-3"
        >
          <MapPin className="w-5 h-5" />
          {t.findHospital}
        </button>

        <button
          onClick={() => navigate("/welcome")}
          className="w-full bg-gray-100 text-gray-700 py-4 rounded-full hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          {t.backHome}
        </button>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
          <p className="text-xs text-yellow-800 text-center">{t.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
