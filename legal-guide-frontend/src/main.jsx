import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext.jsx";

createRoot(document.getElementById("root")).render(
  <LanguageProvider>
    <ThemeProvider>
      <AuthProvider>
        <StrictMode>
          {/* GH Pages-ийн /legal-guide/ дэд зам дээр ч зөв ажиллуулахын тулд basename өгнө */}
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <App />
          </BrowserRouter>
        </StrictMode>
      </AuthProvider>
    </ThemeProvider>
  </LanguageProvider>,
);
