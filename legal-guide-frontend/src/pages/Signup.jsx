import { useState } from "react";
import axios from "../utils/axios";
import { googleicon } from "../assets";

const Signup = ({ onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passRepeat, setPassRepeat] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleType = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "passRepeat") setPassRepeat(value);
    setError(null);
  };

  const handleClick = () => {
    setLoading(true);
    setError(null);
    axios
      .post("users/register", { name, email, password })
      .then((result) => {
        onSignup(result.data.token);
      })
      .catch((error) => {
        setError(error.response?.data?.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClickGoogle = () => {
    setGoogleLoading(true);
    setError(null);
    window.location.href = "http://localhost:5000/api/v1/users/google";
    setGoogleLoading(false);
  };

  const isFormValid = name && email && password && password === passRepeat;

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && isFormValid && !loading) {
      handleClick();
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-200 min-h-screen">
      <div className="bg-gray-100 p-6 rounded-lg shadow-xl w-90">
        <h1 className="text-xl font-bold text-center text-gray-800">
          Бүртгүүлэх
        </h1>
        {error && (
          <div className="bg-red-500 text-white text-sm p-3 rounded-md mt-3 animate-fade-in">
            {error}
          </div>
        )}
        <div className="mt-5">
          <input
            name="name"
            type="text"
            placeholder="Нэр"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={handleType}
            onKeyDown={handleEnterKey}
          />
        </div>
        <div className="mt-3">
          <input
            name="email"
            type="email"
            placeholder="Имэйл"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={handleType}
            onKeyDown={handleEnterKey}
          />
        </div>
        <div className="mt-3">
          <input
            name="password"
            type="password"
            placeholder="Нууц үг"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={handleType}
            onKeyDown={handleEnterKey}
          />
        </div>
        <div className="mt-3">
          <input
            name="passRepeat"
            type="password"
            placeholder="Нууц үг давтах"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={handleType}
            onKeyDown={handleEnterKey}
          />
        </div>
        <button
          type="submit"
          className="w-full mt-5 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
          onClick={handleClick}
          disabled={!isFormValid || loading}
        >
          {loading ? "Түр хүлээнэ үү..." : "Бүртгүүлэх"}
        </button>
        <button
          type="submit"
          className="w-full mt-5 bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition flex items-center justify-center gap-3"
          onClick={handleClickGoogle}
          disabled={googleLoading}
        >
          {googleLoading ? (
            "Түр хүлээнэ үү..."
          ) : (
            <>
              <img src={googleicon} alt="Google Icon" className="w-5 h-5" />
              Google хаягаар бүртгүүлэх
            </>
          )}
        </button>
        <div className="mt-3 text-center">
          <label>Бүртгэлтэй юу? </label>
          <a href="/login" className="text-blue-500 underline">
            Нэвтрэх
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
