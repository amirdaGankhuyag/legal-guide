import { useState } from "react";
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
    <div className="font-code flex min-h-screen items-center justify-center bg-gray-200">
      <div className="w-95 rounded-lg bg-gray-100 p-6 shadow-xl">
        <h1 className="text-center text-xl font-bold text-gray-800">
          Нууц үг сэргээх
        </h1>
        <form onSubmit={handleSubmit} className="mt-5">
          <input
            type="email"
            placeholder="Бүртгэлтэй имэйл хаягаа оруулна уу"
            className="h-9 w-full rounded-md border border-gray-300 p-2"
            value={email}
            onChange={handleType}
          />
          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
            disabled={!email || loading}
          >
            {loading ? "Илгээж байна..." : "Илгээх"}
          </button>
        </form>
        <div className="mt-3 text-center">
          <a href="/login" className="text-blue-500 underline">
            Буцах
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
