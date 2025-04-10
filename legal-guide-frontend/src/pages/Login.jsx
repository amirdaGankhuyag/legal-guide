import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axios";
import { googleicon } from "../assets";
import { useAuth } from "../context/AuthContext";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { isAuth } = useAuth();

  const handleType = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleClick = () => {
    setLoading(true);
    axios
      .post("users/login", { email, password })
      .then((result) => {
        onLogin(result.data.token, result.data.user.role);
      })
      .catch((error) => {
        toast.error(error.response?.data?.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClickGoogle = () => {
    setGoogleLoading(true);
    window.location.href = "http://localhost:5000/api/v1/users/google";
    setGoogleLoading(false);
  };

  const isFormValid = email && password;

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && email && !loading) {
      handleClick();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200">
      <div className="w-90 rounded-lg bg-gray-100 p-6 shadow-xl">
        <h1 className="text-center text-xl font-bold text-gray-800">Нэвтрэх</h1>
        <div className="mt-5">
          <input
            name="email"
            type="email"
            placeholder="Имэйл"
            className="h-9 w-full rounded-md border border-gray-300 p-2"
            onChange={handleType}
            onKeyDown={handleEnterKey}
          />
        </div>
        <div className="mt-3">
          <input
            name="password"
            type="password"
            placeholder="Нууц үг"
            className="h-9 w-full rounded-md border border-gray-300 p-2"
            onChange={handleType}
            onKeyDown={handleEnterKey}
          />
        </div>

        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
          onClick={handleClick}
          disabled={!isFormValid || loading}
        >
          {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
        </button>
        <button
          type="submit"
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-lg bg-gray-900 py-2 text-white transition hover:bg-black disabled:bg-gray-400"
          onClick={handleClickGoogle}
          disabled={googleLoading}
        >
          {googleLoading ? (
            "Түр хүлээнэ үү..."
          ) : (
            <>
              <img src={googleicon} alt="Google Icon" className="h-5 w-5" />
              Google хаягаар нэвтрэх
            </>
          )}
        </button>
        <div className="mt-3 text-center">
          <label>Бүртгэлгүй юу? </label>
          <a href="/signup" className="text-blue-500 underline">
            Бүртгүүлэх
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
