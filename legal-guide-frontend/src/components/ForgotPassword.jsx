import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleType = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Имэйл хаягаа оруулна уу!");
      return;
    }
    setLoading(true);
    axios
      .post("/users/forgot-password", { email })
      .then(() => {
        toast.success("Нууц үг сэргээх холбоос имэйлээр илгээгдлээ!");
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Алдаа гарлаа");
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
          Нууц үг сэргээх
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
          Бүртгэлтэй имэйл хаягаа оруулна уу
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Имэйл
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              value={email}
              onChange={handleType}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
            disabled={!email || loading}
          >
            {loading ? "Илгээж байна..." : "Илгээх"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            ← Нэвтрэх хуудас руу буцах
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
