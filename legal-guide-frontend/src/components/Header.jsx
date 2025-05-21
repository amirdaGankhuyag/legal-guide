import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { jwtDecode } from "jwt-decode";

import { navigation } from "../constants";
import { legalguide } from "../assets";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";

const Header = () => {
  const pathname = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);
  const { isAuth, isAdmin, logout } = useAuth();
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
      .then((result) => {})
      .catch((error) => {
        console.log(error);
      });
    navigate("/login");
  };

  const getFilteredNavigation = () => {
    if (!isAuth)
      return navigation.filter((item) => ["0", "4", "5"].includes(item.id));

    const base = navigation.filter((item) =>
      ["0", "1", "2", "3"].includes(item.id),
    );

    if (isAdmin) return [...base, navigation.find((item) => item.id === "7")];

    return base;
  };
  const filteredNavigation = getFilteredNavigation();

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-50 w-full border-b border-neutral-600 lg:bg-neutral-800/90 lg:backdrop-blur-sm ${
          openNavigation ? "bg-neutral-800" : "bg-neutral-800/90 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center px-5 max-lg:py-4 lg:px-7.5 xl:px-10">
          <a className="block w-[12rem] xl:mr-8" href="/">
            <img src={legalguide} width={190} height={40} alt="LegalGudie" />
          </a>
          <nav
            className={` ${
              openNavigation ? "flex" : "hidden"
            } fixed top-[6.5rem] right-0 bottom-0 left-0 bg-neutral-800 lg:static lg:mx-auto lg:flex lg:bg-transparent`}
          >
            <div className="relative z-2 m-auto flex flex-col items-center justify-center lg:flex-row">
              {filteredNavigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={item.id === "6" ? handleLogout : handleClick}
                  className={`font-code relative block text-2xl text-neutral-100 uppercase transition-colors hover:text-purple-700 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                    item.url === pathname.hash
                      ? "z-2 lg:text-neutral-100"
                      : "lg:text-neutral-100/50"
                  } lg:leading-5 lg:hover:text-neutral-100 xl:px-12`}
                >
                  {item.title}
                </a>
              ))}
            </div>
            <HamburgerMenu />
          </nav>

          {isAuth ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
                className="button items-center text-neutral-100 transition-colors hover:text-purple-700 max-sm:hidden sm:hidden lg:flex"
              >
                {userName}
              </button>
              <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
              />
            </div>
          ) : (
            <>
              <a
                href="/signup"
                className="button mr-8 hidden text-neutral-100/50 transition-colors hover:text-neutral-100 lg:block"
              >
                Бүртгүүлэх
              </a>
              <Button className="max-sm:hidden sm:hidden lg:flex" href="/login">
                Нэвтрэх
              </Button>
            </>
          )}
          <Button
            className="ml-auto lg:hidden"
            px="px-3"
            onClick={toggleNavigation}
          >
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;
