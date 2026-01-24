import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import HomePage from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./Layout";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import { ProtectedLayout } from "./ProtectedLayout";
import { useAxiosInterceptor } from "./hooks/useAxiosInterceptor";
import PublicRoute from "./PublicLayout";
import MyBetsPage from "./pages/MyBets";
import MyProfilePage from "./pages/MyProfile";
import MatchesPage from "./pages/Matches";
import ToplistPage from "./pages/Toplist";
import MatchDetailPage from "./pages/MatchDetail";
import MyTransactions from "./pages/MyTransactions";
import GroupTables from "./pages/GroupTables";

function App() {
  useAxiosInterceptor();
  return (
    <Routes>
      {/* PUBLIC ROUTES (ha be van lépve → redirect) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="fooldal" />} />
          <Route path="fooldal" element={<HomePage />} />
          <Route path="fogadasaim" element={<MyBetsPage />} />
          <Route path="profilom" element={<MyProfilePage />} />
          <Route path="merkozesek" element={<MatchesPage />} />
          <Route path="merkozesek/:id" element={<MatchDetailPage />} />
          <Route path="toplista" element={<ToplistPage />} />
          <Route path="csoportok" element={<GroupTables />} />
          <Route path="transactions" element={<MyTransactions />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
