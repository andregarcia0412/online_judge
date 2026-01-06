import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth } from "../pages/auth";
import { Home } from "../pages/home";
import { NotFound } from "../pages/not-found/NotFound";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
