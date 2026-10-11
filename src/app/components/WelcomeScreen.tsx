import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Activity, LogOut } from "lucide-react";
import type { NavigateFn } from "../App";

interface Props {
  navigate: NavigateFn;
}

export function WelcomeScreen({ navigate }: Props) {
  const handleLogout = () => {
    localStorage.removeItem("medicoLoggedIn");
    navigate("/");
  };

  const user = (() => {
    try {
      const stored = localStorage.getItem("medicoUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();
  const isGuest = typeof window !== "undefined" && localStorage.getItem("medicoLoggedIn") === "guest";
  const displayName = isGuest ? "Guest User" : (user?.name || user?.email?.split('@')[0] || "");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-6">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Logout</span>
      </button>

      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-6 bg-blue-600 p-4 rounded-full shadow-lg">
          <Activity className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>

        <h1 className="text-4xl font-bold text-blue-900 mb-1 text-center">MEDICO</h1>
        {displayName && (
          <p className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-2">
            Welcome, {displayName}!
          </p>
        )}
        <p className="text-lg text-blue-600 mb-8 text-center">AI Powered Symptom Checker</p>

        <div className="w-full mb-10 rounded-2xl overflow-hidden shadow-xl">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwQUklMjBkb2N0b3IlMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzczMjEwNjIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Medical AI illustration"
            className="w-full h-64 object-cover"
          />
        </div>

        <button
          onClick={() => navigate("/language")}
          className="w-full bg-blue-600 text-white py-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
        >
          Start Diagnosis
        </button>

        <p className="text-xs text-gray-500 text-center mt-6 px-4">
          This is not a substitute for professional medical advice. Always consult with a healthcare provider.
        </p>
      </div>
    </div>
  );
}
