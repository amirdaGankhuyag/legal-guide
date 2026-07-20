import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axios";
import { legalguide } from "../assets";

// Login.jsx-тэй ижил indigo/slate дизайны системд шилжүүлэв

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Бүх талбарыг бөглөнө үү");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Нууц үгүүд таарахгүй байна");
      return;
    }
    setLoading(true);
    axios
      .post(`/users/reset-password`, { password, resetToken: token })
      .then(() => {
        toast.success("Нууц үг амжилттай шинэчлэгдлээ!");
        navigate("/login"); // Амжилттай бол login руу буцаана
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Алдаа гарлаа");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const inputClasses =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white";

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
        <Link to="/" className="mb-6 flex justify-center">
          <img src={legalguide} width={130} height={28} alt="LegalGuide" />
        </Link>
        <h1 className="text-center text-xl font-bold text-slate-900 dark:text-white">
          Нууц үг шинэчлэх
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Шинэ нууц үг
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClasses}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Нууц үг давтах
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClasses}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
            disabled={!password || !confirmPassword || loading}
          >
            {loading ? "Шинэчилж байна..." : "Шинэчлэх"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
