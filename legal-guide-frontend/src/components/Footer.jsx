import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { legalguide } from "../assets";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white font-sans dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 py-6 text-sm md:flex-row md:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={legalguide} width={120} height={26} alt="LegalGuide" />
        </Link>

        <p className="text-center text-slate-500 md:text-left dark:text-slate-400">
          © 2026 LegalGuide · Системийг хөгжүүлсэн Г. Амирда
        </p>

        <div className="flex items-center gap-2">
          <a
            href="https://www.facebook.com/Gankhuyag.Amirda/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
          >
            <FaFacebook size={14} />
          </a>
          <a
            href="https://www.instagram.com/amirda.mrd/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
          >
            <FaInstagram size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
