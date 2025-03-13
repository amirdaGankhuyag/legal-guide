import { useState } from "react";
import axios from "../utils/axios";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleType = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    setError(null);
  };

  const handleClick = () => {
    setLoading(true);
    setError(null);
    axios
      .post("users/login", { email, password })
      .then((result) => {
        onLogin(result.data.token);
      })
      .catch((error) => {
        setError(error.response?.data?.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700">
          Нэвтрэх
        </h1>
        {error && (
          <div className="bg-red-500 text-white text-sm p-3 rounded-md mt-3 animate-fade-in">
            {error}
          </div>
        )}
        <div className="mt-5">
          <label className="block text-gray-600 text-sm mb-1">Имэйл</label>
          <input
            placeholder="Имэйл хаягаа оруулна уу"
            type="email"
            name="email"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleType}
          />
        </div>
        <div className="mt-3">
          <label className="block text-gray-600 text-sm mb-1">Нууц үг</label>
          <input
            placeholder="Нууц үгээ оруулна уу"
            type="password"
            name="password"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleType}
          />
        </div>
        <button
          type="submit"
          onClick={handleClick}
          disabled={loading}
          className="w-full mt-5 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
        </button>
      </div>
    </div>
  );
};

export default Login;
