import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Auth from "./pages/auth";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Auth />
    </AuthProvider>
  </StrictMode>
);
