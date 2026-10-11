import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LanguageScreen } from "./components/LanguageScreen";
import { ChatbotScreen } from "./components/ChatbotScreen";
import { DiagnosisScreen } from "./components/DiagnosisScreen";
import { EmergencyScreen } from "./components/EmergencyScreen";

export type Screen = "/" | "/welcome" | "/language" | "/chat" | "/diagnosis" | "/emergency";

export interface NavState {
  language?: string;
  symptoms?: unknown[];
  predictions?: unknown[];
}

export type NavigateFn = (screen: Screen, state?: NavState) => void;

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const loggedIn = localStorage.getItem("medicoLoggedIn");
      return (loggedIn === "true" || loggedIn === "guest") ? "/welcome" : "/";
    } catch {
      return "/";
    }
  });
  const [navState, setNavState] = useState<NavState>({});

  const navigate: NavigateFn = (nextScreen, state = {}) => {
    setNavState(state);
    setScreen(nextScreen);
  };

  const props = { navigate, locationState: navState };

  switch (screen) {
    case "/welcome":
      return <WelcomeScreen {...props} />;
    case "/language":
      return <LanguageScreen {...props} />;
    case "/chat":
      return <ChatbotScreen {...props} />;
    case "/diagnosis":
      return <DiagnosisScreen {...props} />;
    case "/emergency":
      return <EmergencyScreen {...props} />;
    default:
      return <LoginScreen {...props} />;
  }
}
