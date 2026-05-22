import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { ProtectedLayout } from "./ProtectedLayout";
import { useAxiosInterceptor } from "./hooks/useAxiosInterceptor";
import PublicRoute from "./PublicLayout";
import { useConfig } from "@/hooks/useConfig";
import PageLoader from "./components/PageLoader";

const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const HomePage = lazy(() => import("./pages/Home"));
const MyBetsPage = lazy(() => import("./pages/MyBets"));
const MyProfilePage = lazy(() => import("./pages/MyProfile"));
const MatchesPage = lazy(() => import("./pages/Matches"));
const ToplistPage = lazy(() => import("./pages/Toplist"));
const MatchDetailPage = lazy(() => import("./pages/MatchDetail"));
const MyTransactions = lazy(() => import("./pages/MyTransactions"));
const GroupTables = lazy(() => import("./pages/GroupTables"));
const TeamDetail = lazy(() => import("./pages/TeamDetail"));
const Statistics = lazy(() => import("./pages/Statistics"));
const MyBadges = lazy(() => import("./pages/MyBadges"));
const GroupDetail = lazy(() => import("./pages/GroupDetail"));
const BracketPage = lazy(() => import("./pages/Bracket"));
const NotificationsPage = lazy(() => import("./pages/Notifications"));

function App() {
  useAxiosInterceptor();
  const { config } = useConfig();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* PUBLIC ROUTES (ha be van lépve → redirect) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          {config?.enabledRegistration && <Route path="/regisztracio" element={<Register />} />}
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
            <Route path="csapatok/:id" element={<TeamDetail />} />
            <Route path="csoportok/:id" element={<GroupDetail />} />
            <Route path="ranglista" element={<ToplistPage />} />
            <Route path="csoportok" element={<GroupTables />} />
            <Route path="kieseses" element={<BracketPage />} />
            <Route path="transactions" element={<MyTransactions />} />
            <Route path="statisztikak" element={<Statistics />} />
            <Route path="mybadges" element={<MyBadges />} />
            <Route path="notification" element={<NotificationsPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
