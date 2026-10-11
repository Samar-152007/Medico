import { Languages, ChevronRight } from "lucide-react";
import type { NavigateFn } from "../App";

interface Props {
  navigate: NavigateFn;
}

export function LanguageScreen({ navigate }: Props) {
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col px-6 py-8">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Languages className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Select Your Language</h2>
          <p className="text-gray-600">Choose your preferred language to continue</p>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => navigate("/chat", { language: language.code })}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 flex items-center justify-between border-2 border-transparent hover:border-blue-200"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{language.flag}</span>
                <span className="text-xl font-semibold text-gray-800">{language.name}</span>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/welcome")}
          className="w-full mt-6 py-3 text-blue-600 font-medium"
        >
          Back
        </button>
      </div>
    </div>
  );
}
