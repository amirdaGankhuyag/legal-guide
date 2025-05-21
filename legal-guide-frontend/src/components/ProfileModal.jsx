import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Button from "./Button";

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

  return (
    <div className="absolute top-full right-0 mt-2 w-80 rounded-lg bg-white shadow-lg backdrop-blur-sm">
      <div className="p-4">
        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : !user ? (
          <div className="flex h-20 items-center justify-center">
            <p className="text-sm text-neutral-100">
              Хэрэглэгчийн мэдээлэл олдсонгүй
            </p>
          </div>
        ) : (
          <>
            {!isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-black">
                    Нэр
                  </label>
                  <p className="mt-1 text-sm text-black">{user.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">
                    И-мэйл
                  </label>
                  <p className="mt-1 text-sm text-black">{user.email}</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setIsEditing(true)} black>
                    Засах
                  </Button>
                  <Button onClick={handleLogout} black>
                    Гарах
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-black">
                    Нэр
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-neutral-600 bg-white px-3 py-1.5 text-sm text-black shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">
                    И-мэйл
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-neutral-600 bg-white px-3 py-1.5 text-sm text-black shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">
                    Одоогийн нууц үг
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-neutral-600 bg-white px-3 py-1.5 text-sm text-neutral-100 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">
                    Шинэ нууц үг
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-neutral-600 bg-white px-3 py-1.5 text-sm text-black shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">
                    Шинэ нууц үг давтах
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-neutral-600 bg-white px-3 py-1.5 text-sm text-neutral-100 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" black>
                    Хадгалах
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    black
                  >
                    Цуцлах
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
