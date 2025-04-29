import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../utils/axios";

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

  return (
    <div className="font-code flex min-h-screen items-center justify-center bg-gray-200">
      <div className="w-90 rounded-lg bg-gray-100 p-6 shadow-xl">
        <h1 className="text-center text-xl font-bold text-gray-800">
          Нууц үг шинэчлэх
        </h1>
        <form onSubmit={handleSubmit} className="mt-5">
          <input
            type="password"
            placeholder="Шинэ нууц үг"
            className="h-9 w-full rounded-md border border-gray-300 p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Нууц үгээ дахин оруулна уу"
            className="mt-3 h-9 w-full rounded-md border border-gray-300 p-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
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
