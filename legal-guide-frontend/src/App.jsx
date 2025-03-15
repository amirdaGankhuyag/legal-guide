import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Header from "./components/Header";
import Success from "./components/Success";
import ButtonGradient from "./assets/svg/ButtonGradient";

const App = () => {
  const navigate = useNavigate();

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    navigate("/");
  };

  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Routes>
          <Route path="login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="success" element={<Success />} />
        </Routes>
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
