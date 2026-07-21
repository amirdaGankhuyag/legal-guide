import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { FiEdit3, FiLogOut, FiX, FiCheck, FiLock } from "react-icons/fi";

const primaryBtn =
  "flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700";
const secondaryBtn =
  "flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";
const inputClasses =
  "mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const labelClasses =
  "block text-xs font-medium text-slate-500 dark:text-slate-400";

const ProfileModal = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
      setIsEditing(false);
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const response = await axios.get(`users/${decoded.id}`);
        setUser(response.data.data);
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Хэрэглэгчийн мэдээлэл татахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.error("Шинэ нууц үг таарахгүй байна");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);

      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await axios.put(`users/${decoded.id}`, updateData);
      toast.success("Мэдээлэл амжилттай шинэчлэгдлээ");
      setIsEditing(false);

      // Refresh user data
      const response = await axios.get(`users/${decoded.id}`);
      setUser(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Алдаа гарлаа");
    }
  };

  const handleLogout = () => {
    logout();
    axios
      .get("users/logout")
      .then(() => {
        navigate("/login");
        toast.success("Системээс гарлаа!");
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!isOpen) return null;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="animate-pop-in absolute top-full right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white font-sans shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : !user ? (
        <div className="flex h-32 items-center justify-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Хэрэглэгчийн мэдээлэл олдсонгүй
          </p>
        </div>
      ) : !isEditing ? (
        <>
          {/* Профайлын толгой хэсэг — indigo/sky зөөлөн градиент дэвсгэр дээр avatar */}
          <div className="relative bg-linear-to-br from-indigo-50 via-white to-sky-50 p-5 text-center dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900">
            <button
              onClick={onClose}
              aria-label="Хаах"
              className="absolute top-3 right-3 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <FiX size={16} />
            </button>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold text-white shadow-md shadow-indigo-600/25">
              {userInitial}
            </span>
            <p className="mt-3 font-semibold text-slate-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>

          <div className="flex gap-2 p-4">
            <button onClick={() => setIsEditing(true)} className={primaryBtn}>
              <FiEdit3 size={15} />
              Засах
            </button>
            <button onClick={handleLogout} className={secondaryBtn}>
              <FiLogOut size={15} />
              Гарах
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Профайл засах
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              aria-label="Хаах"
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <FiX size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className={labelClasses}>Нэр</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>И-мэйл</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
          </div>

          {/* Нууц үг солих хэсгийг тусад нь ялгаж, заавал биш гэдгийг тодотгов */}
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
              <FiLock size={12} />
              Нууц үг солих (заавал биш)
            </p>
            <div className="space-y-3">
              <div>
                <label className={labelClasses}>Одоогийн нууц үг</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Шинэ нууц үг</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Шинэ нууц үг давтах</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button type="submit" className={primaryBtn}>
              <FiCheck size={15} />
              Хадгалах
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={secondaryBtn}
            >
              Цуцлах
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileModal;
