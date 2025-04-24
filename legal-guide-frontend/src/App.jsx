import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminPanel from "./pages/AdminPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Firms from "./pages/Firms";
import FirmDetails from "./pages/FirmDetails";
import Lawyers from "./pages/Lawyers";
import LawyerDetails from "./pages/LawyerDetails";
import Infos from "./pages/Infos";
import InfoDetails from "./pages/InfoDetails";
import Success from "./components/Success";
import ButtonGradient from "./assets/svg/ButtonGradient";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { toast } from "react-toastify";

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
      <div className="overflow-hidden pt-[6.5rem] lg:pt-[5.25rem]">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute admin />}>
            <Route path="admin" element={<AdminPanel />} />
          </Route>
          <Route path="login" element={<Login onLogin={handleLogin} />} />
          <Route path="signup" element={<Signup onSignup={handleSignup} />} />
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
        <Footer />
      </div>
      <ButtonGradient />
    </QueryClientProvider>
  );
};

export default App;
