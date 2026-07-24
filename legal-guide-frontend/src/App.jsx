import { lazy, Suspense } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/ProtectedRoute";
// Route-based lazy loading for better performance and code splitting
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home"));
const Firms = lazy(() => import("./pages/Firms"));
const FirmDetails = lazy(() => import("./pages/FirmDetails"));
const Lawyers = lazy(() => import("./pages/Lawyers"));
const LawyerDetails = lazy(() => import("./pages/LawyerDetails"));
const Infos = lazy(() => import("./pages/Infos"));
const InfoDetails = lazy(() => import("./pages/InfoDetails"));
const Success = lazy(() => import("./components/Success"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));

const queryClient = new QueryClient();

const App = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (token) => {
    login(token);
    navigate("/");
    toast.success("Амжилттай нэвтэрлээ!");
  };

  //Бүртгэл амжилттай нэвтэрч орно уу
  const handleSignup = () => {
    navigate("/login");
    toast.success("Амжилттай бүртгүүллээ. Нэвтэрч орно уу!");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        limit={3}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover={false}
        theme="dark"
      />
      <div className="flex min-h-screen flex-col overflow-hidden bg-white pt-[4.75rem] dark:bg-slate-950">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route element={<ProtectedRoute admin />}>
                <Route path="admin" element={<AdminPanel />} />
              </Route>
              <Route path="login" element={<Login onLogin={handleLogin} />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              <Route
                path="signup"
                element={<Signup onSignup={handleSignup} />}
              />
              <Route path="success" element={<Success />} />
              <Route element={<ProtectedRoute />}>
                <Route path="firms" element={<Firms />} />
                <Route path="firms/:id" element={<FirmDetails />} />
                <Route path="lawyers" element={<Lawyers />} />
                <Route path="lawyers/:id" element={<LawyerDetails />} />
                <Route path="infos" element={<Infos />} />
                <Route path="infos/:id" element={<InfoDetails />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default App;
