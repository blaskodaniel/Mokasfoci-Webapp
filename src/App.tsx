import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import HomePage from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./Layout";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import { ProtectedLayout } from "./ProtectedLayout";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="fooldal" />} />
          <Route path="fooldal" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
