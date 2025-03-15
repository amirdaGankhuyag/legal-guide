import { useState } from "react";
import axios from "../utils/axios";
import { googleicon } from "../assets";

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

  const handleClickGoogle = () => {
    setLoading(true);
    setError(null);
    window.location.href = "http://localhost:5000/api/v1/users/google";
    setLoading(false);
    console.log("Google нэвтрэх");
  };

  return (
    <div className="flex items-center justify-center bg-gray-200 min-h-screen">
      <div className="bg-gray-100 p-6 rounded-lg shadow-xl w-90">
        <h1 className="text-xl font-bold text-center text-gray-800">Нэвтрэх</h1>
        {error && (
          <div className="bg-red-500 text-white text-sm p-3 rounded-md mt-3 animate-fade-in">
            {error}
          </div>
        )}
        <div className="mt-5">
          <input
            placeholder="Имэйл"
            type="email"
            name="email"
            className="w-full p-2 border bg-white h-9 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleType}
          />
        </div>
        <div className="mt-3">
          <input
            placeholder="Нууц үг"
            type="password"
            name="password"
            className="w-full p-2 border rounded-md bg-white h-9 border-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
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
        <button
          type="submit"
          onClick={handleClickGoogle}
          disabled={loading}
          className="w-full mt-5 bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition disabled:bg-gray-400 flex items-center justify-center gap-3"
        >
          {loading ? (
            "Түр хүлээнэ үү..."
          ) : (
            <>
              <img src={googleicon} alt="Google Icon" className="w-5 h-5" />
              Google хаягаар нэвтрэх
            </>
          )}
        </button>
        <div className="mt-3 text-center">
          <a href="/signup" className="text-blue-500">
            Бүртгүүлэх
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
