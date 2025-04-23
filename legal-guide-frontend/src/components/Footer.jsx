import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="font-code bg-neutral-800/90 py-5 font-semibold text-white">
      <div className="container mx-auto flex flex-col items-center justify-between text-center md:flex-row md:text-left">
        <p className="md:text-md mb-4 text-sm md:mb-0">
          © 2025 Legal Guide.
        </p>
        <div className="mt-4 flex flex-wrap justify-center space-x-6 md:mt-0 md:justify-end">
          <p className="md:text-md mb-4 text-center text-sm md:mb-0 md:text-left">
            Системийг хөгжүүлсэн Г. Амирда
          </p>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/Gankhuyag.Amirda/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors duration-300 hover:text-blue-600"
            >
              <FaFacebook className="text-xl" />
            </a>
            <a
              href="https://www.instagram.com/amirda.mrd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors duration-300 hover:text-pink-500"
            >
              <FaInstagram className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
