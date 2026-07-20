import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axios";
import { googleicon } from "../assets";

// Login.jsx-тэй ижил indigo/slate дизайны системд шилжүүлэв

const Signup = ({ onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passRepeat, setPassRepeat] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleType = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "passRepeat") setPassRepeat(value);
  };

  const handleClick = () => {
    setLoading(true);
    axios
      .post("users/register", { name, email, password })
      .then((result) => {
        onSignup(result.data.token);
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
    window.location.href = `${axios.defaults.baseURL}users/google`;
    setGoogleLoading(false);
  };

  const isFormValid = name && email && password && password === passRepeat;
  const passwordsMismatch = passRepeat.length > 0 && password !== passRepeat;

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && isFormValid && !loading) {
      handleClick();
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white";
  const labelClasses =
    "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div className="font-sans relative flex min-h-[calc(100vh-4.75rem)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950">
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
          Бүртгүүлэх
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
          Үнэгүй эрх үүсгэж эхлээрэй
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className={labelClasses}>Нэр</label>
            <input
              name="name"
              type="text"
              placeholder="Таны нэр"
              className={inputClasses}
              onChange={handleType}
              onKeyDown={handleEnterKey}
            />
          </div>
          <div>
            <label className={labelClasses}>Имэйл</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className={inputClasses}
              onChange={handleType}
              onKeyDown={handleEnterKey}
            />
          </div>
          <div>
            <label className={labelClasses}>Нууц үг</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className={inputClasses}
              onChange={handleType}
              onKeyDown={handleEnterKey}
            />
          </div>
          <div>
            <label className={labelClasses}>Нууц үг давтах</label>
            <input
              name="passRepeat"
              type="password"
              placeholder="••••••••"
              className={inputClasses}
              onChange={handleType}
              onKeyDown={handleEnterKey}
            />
            {passwordsMismatch && (
              <p className="mt-1 text-xs text-red-500">
                Нууц үг таарахгүй байна
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
          onClick={handleClick}
          disabled={!isFormValid || loading}
        >
          {loading ? "Түр хүлээнэ үү..." : "Бүртгүүлэх"}
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
              Google хаягаар бүртгүүлэх
            </>
          )}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Бүртгэлтэй юу?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Нэвтрэх
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
