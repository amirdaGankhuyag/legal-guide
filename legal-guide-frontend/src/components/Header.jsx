import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { jwtDecode } from "jwt-decode";
import { FiSun, FiMoon } from "react-icons/fi";

import { navigation } from "../constants";
import Logo from "./Logo";
import MenuSvg from "../assets/svg/MenuSvg";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ProfileModal from "./ProfileModal";

const Header = () => {
  const pathname = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);
  const { isAuth, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (isAuth) {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          try {
            const response = await axios.get(`users/${decoded.id}`);
            setUserName(response.data.data.name);
          } catch (error) {
            console.error("Error fetching user name:", error);
          }
        }
      }
    };

    fetchUserName();
  }, [isAuth]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  const handleLogout = () => {
    logout();
    axios
      .get("users/logout")
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
    navigate("/login");
  };

  const getFilteredNavigation = () => {
    if (!isAuth)
      return navigation.filter((item) => ["0", "4", "5"].includes(item.id));

    const base = navigation.filter((item) =>
      ["0", "1", "2", "3", "8"].includes(item.id),
    );

    if (isAdmin) return [...base, navigation.find((item) => item.id === "7")];

    return base;
  };
  const filteredNavigation = getFilteredNavigation();

  const userInitial = userName ? userName.charAt(0).toUpperCase() : "?";

  // Desktop (header мөрөнд шууд орох) болон mobile (бүтэн дэлгэцийн overlay)
  const navLinks = filteredNavigation.map((item) => (
    <Link
      key={item.id}
      to={item.url}
      onClick={
        // Нэвтэрсэн үед Гарах нь id "8" тул хоёуланг нь шалгана
        item.id === "6" || item.id === "8" ? handleLogout : handleClick
      }
      className={`relative block rounded-lg px-5 py-4 text-2xl font-semibold text-slate-800 transition-colors hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400 ${
        item.onlyMobile ? "lg:hidden" : ""
      } lg:px-4 lg:py-2 lg:text-sm lg:font-medium ${
        item.url === pathname.pathname
          ? "lg:text-indigo-600 dark:lg:text-indigo-400"
          : "lg:text-slate-600 dark:lg:text-slate-300"
      } lg:hover:bg-slate-50 dark:lg:hover:bg-slate-800`}
    >
      {item.title}
    </Link>
  ));

  return (
    <>
      <div className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        {/* min-h-[4.75rem] — App.jsx-ийн pt offset-той таарч, mobile/desktop хоёуланд ижил өндөртэй байлгана */}
        <div className="container mx-auto flex min-h-[4.75rem] items-center px-5 py-3 font-sans lg:px-8">
          <Link className="block w-[10rem] xl:mr-8" to="/">
            <Logo width={160} height={34} />
          </Link>

          {/* Desktop цэс — header мөрөнд шууд, ямар ч fixed positioning хэрэггүй */}
          <nav className="hidden lg:mx-auto lg:flex lg:items-center lg:gap-1">
            {navLinks}
          </nav>

          {/* Баруун талын хэсэг: theme toggle + профайл/нэвтрэх + мобайлын цэсний товч */}
          <div className="ml-auto flex items-center gap-3">
            {/* Dark/Light mode */}
            <button
              onClick={toggleTheme}
              aria-label="Өнгө үзэмжийг сэлгэх"
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {isAuth ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pr-4 pl-1 transition-colors hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-700 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                    {userInitial}
                  </span>
                  <span className="hidden text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
                    {userName}
                  </span>
                </button>
                <ProfileModal
                  isOpen={isProfileModalOpen}
                  onClose={() => setIsProfileModalOpen(false)}
                />
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 lg:block dark:text-slate-300 dark:hover:text-indigo-400"
                >
                  Нэвтрэх
                </Link>
                <Link
                  to="/signup"
                  className="hidden rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 lg:block"
                >
                  Бүртгүүлэх
                </Link>
              </>
            )}
            <button
              className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={toggleNavigation}
            >
              <MenuSvg openNavigation={openNavigation} />
            </button>
          </div>
        </div>
      </div>

      {/* Мобайл цэсний overlay-г backdrop-blur header-ээс ГАДНА (sibling) байрлуулна.
          Учир нь эцэг элементийн backdrop-filter (backdrop-blur-md) нь дотор орших
          position:fixed хүүхдийн "containing block"-ыг эвдэж, viewport биш зөвхөн
          эцэг элементийнхээ (4.75rem өндөр) хэмжээгээр top/bottom тооцоолуулж,
          дэлгэц бүрэн бус зөвхөн нарийн зурвас мэт хумигддаг CSS-ийн мэдэгдэж
          буй зан үйл юм. */}
      <nav
        className={`${
          openNavigation ? "flex" : "hidden"
        } fixed inset-x-0 top-[4.75rem] bottom-0 z-40 flex-col items-center justify-center gap-1 bg-linear-to-br from-white via-indigo-50 to-sky-50 font-sans lg:hidden dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900`}
      >
        {navLinks}
      </nav>
    </>
  );
};

export default Header;
