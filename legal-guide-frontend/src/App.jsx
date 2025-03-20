import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Success from "./components/Success";
import ButtonGradient from "./assets/svg/ButtonGradient";

const App = () => {
  const navigate = useNavigate();

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    navigate("/");
  };

  //Бүртгэл амжилттай нэвтэрч орно уу

  return (
    <>
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
          <Route path="about" element={<About />} />
          <Route path="success" element={<Success />} />
        </Routes>
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
