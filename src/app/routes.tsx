import React from "react";
import { createBrowserRouter, useNavigate, useLocation } from "react-router-dom";
import { LoginScreen } from "./components/LoginScreen";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LanguageScreen } from "./components/LanguageScreen";
import { ChatbotScreen } from "./components/ChatbotScreen";
import { DiagnosisScreen } from "./components/DiagnosisScreen";
import { EmergencyScreen } from "./components/EmergencyScreen";
import type { Screen, NavState } from "./App";

interface ScreenProps {
  navigate: (screen: Screen, state?: NavState) => void;
  locationState?: NavState;
}

function withRouterProps<P extends ScreenProps>(
  Component: React.ComponentType<P>
) {
  return function WithRouterPropsWrapper() {
    const routerNavigate = useNavigate();
    const location = useLocation();

    const navigate = (screen: Screen, state: NavState = {}) => {
      routerNavigate(screen, { state });
    };

    const locationState = (location.state as NavState) || {};

    return <Component {...({ navigate, locationState } as P)} />;
  };
}

const LoginRoute = withRouterProps(LoginScreen);
const WelcomeRoute = withRouterProps(WelcomeScreen);
const LanguageRoute = withRouterProps(LanguageScreen);
const ChatbotRoute = withRouterProps(ChatbotScreen);
const DiagnosisRoute = withRouterProps(DiagnosisScreen);
const EmergencyRoute = withRouterProps(EmergencyScreen);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginRoute />,
  },
  {
    path: "/welcome",
    element: <WelcomeRoute />,
  },
  {
    path: "/language",
    element: <LanguageRoute />,
  },
  {
    path: "/chat",
    element: <ChatbotRoute />,
  },
  {
    path: "/diagnosis",
    element: <DiagnosisRoute />,
  },
  {
    path: "/emergency",
    element: <EmergencyRoute />,
  },
]);