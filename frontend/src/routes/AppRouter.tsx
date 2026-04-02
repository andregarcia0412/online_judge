import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth } from "../pages/auth";
import { Home } from "../pages/home";
import { NotFound } from "../pages/not-found/NotFound";
import { PrivateRoute } from "./PrivateRoute";
import { SubmissionScreen } from "../pages/submission";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/submission/:idProblem" element={<SubmissionScreen />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
