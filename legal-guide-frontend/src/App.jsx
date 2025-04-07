import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Firms from "./pages/Firms";
import FirmDetails from "./pages/FirmDetails";
import Lawyers from "./pages/Lawyers";
import LawyerDetails from "./pages/LawyerDetails";
import Info from "./pages/Info";
import Success from "./components/Success";
import ButtonGradient from "./assets/svg/ButtonGradient";

const queryClient = new QueryClient();

const App = () => {
  const navigate = useNavigate();

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    navigate("/");
  };

  //Бүртгэл амжилттай нэвтэрч орно уу

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
      <div className="overflow-hidden pt-[4.75rem] lg:pt-[5.25rem]">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login onLogin={handleLogin} />} />
          <Route path="signup" element={<Signup onSignup={handleLogin} />} />
          <Route path="info" element={<Info />} />
          <Route path="lawyers" element={<Lawyers />} />
          <Route path="lawyers/:id" element={<LawyerDetails />} />
          <Route path="firms" element={<Firms />} />
          <Route path="firms/:id" element={<FirmDetails />} />
          <Route path="success" element={<Success />} />
        </Routes>
        <Footer />
      </div>
      <ButtonGradient />
    </QueryClientProvider>
  );
};

export default App;
