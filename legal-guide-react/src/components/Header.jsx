import { useLocation } from "react-router-dom";
import { navigation } from "../constants";
import { legalguide } from "../assets";
import Button from "./Button";

const Header = () => {
  const pathname = useLocation();
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-neutral-800/90 backdrop-blur-sm border-b border-neutral-600 lg:bg-neutral-800/90 lg:backdrop-blur-sm">
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem] xl:mr-8" href="#hero">
          <img src={legalguide} width={170} height={40} alt="LegalGudie" />
        </a>
        <nav className="hidden fixed top-[5rem] left-0 right-0 bottom-0 bg-neutral-800 lg:static lg:flex lg:mx-auto lg:bg-transparent">
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                className={`block relative font-sans text-2xl uppercase text-neutral-100 transition-colors hover:text-purple-700 ${
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
        </nav>

        <a
          href="#signup"
          className="button hidden mr-8 text-neutral-100/50 transition-colors hover:text-neutral-100 lg:block"
        >
          Бүртгүүлэх
        </a>
        <Button className="hidden lg:flex" href="#login">
          Нэвтрэх
        </Button>
      </div>
    </div>
  );
};

export default Header;
