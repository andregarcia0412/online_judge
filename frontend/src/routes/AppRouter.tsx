import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth } from "../pages/auth";
import { Home } from "../pages/home";
import { NotFound } from "../pages/not-found/NotFound";
import { PrivateRoute } from "./PrivateRoute";
import { ProblemScreen } from "../pages/problem";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/problem/:idProblem" element={<ProblemScreen />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
