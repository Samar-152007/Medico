import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { LoginScreen } from "./components/LoginScreen";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LanguageScreen } from "./components/LanguageScreen";
import { ChatbotScreen } from "./components/ChatbotScreen";
import { DiagnosisScreen } from "./components/DiagnosisScreen";
import { EmergencyScreen } from "./components/EmergencyScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginScreen />,
  },
  {
    path: "/welcome",
    element: <WelcomeScreen />,
  },
  {
    path: "/language",
    element: <LanguageScreen />,
  },
  {
    path: "/chat",
    element: <ChatbotScreen />,
  },
  {
    path: "/diagnosis",
    element: <DiagnosisScreen />,
  },
  {
    path: "/emergency",
    element: <EmergencyScreen />,
  },
]);