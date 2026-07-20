import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axios";
import { googleicon } from "../assets";

// Хуучин Login.jsx нь placeholder-аар л input ялгадаг, бараан Google товчтой,
// bg-gray-200 энгийн загвартай байсныг Home/Header-ийн indigo/slate дизайны
// системд нийцүүлж label-тэй input, гадна хүрээтэй Google товч, dark mode-той болгов.

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
        onLogin(result.data.token);
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
    // window.location.href = "http://localhost:5000/api/v1/users/google";
    // Backend-ийн хаягийг axios-ийн baseURL (VITE_API_URL)-аас авна
    window.location.href = `${axios.defaults.baseURL}users/google`;
    setGoogleLoading(false);
  };

  const isFormValid = email && password;

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && email && !loading) {
      handleClick();
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4.75rem)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 font-sans dark:bg-slate-950">
      {/* Home hero-той нэгдсэн indigo/sky blur blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-900/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-900/20"
      />

      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-center text-xl font-bold text-slate-900 dark:text-white">
          Нэвтрэх
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
          Дахин тавтай морил!
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Имэйл
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              onChange={handleType}
              onKeyDown={handleEnterKey}
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Нууц үг
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Мартсан уу?
              </Link>
            </div>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              onChange={handleType}
              onKeyDown={handleEnterKey}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
          onClick={handleClick}
          disabled={!isFormValid || loading}
        >
          {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs text-slate-400 dark:text-slate-500">
            эсвэл
          </span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
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

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Бүртгэлгүй юу?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Бүртгүүлэх
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
