import { useState } from "react";
import FirmForm from "../components/FirmForm";
import LawyerForm from "../components/LawyerForm";
import InfoForm from "../components/InfoForm";

// Firms.jsx-ийн segmented control хэв маягтай нийцүүлэв

const sections = [
  { key: "firm", label: "Фирм" },
  { key: "lawyer", label: "Хуульч" },
  { key: "info", label: "Мэдээлэл" },
];

const AdminPanel = () => {
  const [section, setSection] = useState("firm");

  return (
    <div className="font-sans min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <h1 className="mb-6 text-center text-2xl font-bold text-slate-900 dark:text-white">
        Админ хуудас
      </h1>
      <div className="mb-4 flex justify-center">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                section === s.key
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {section === "firm" && <FirmForm />}
      {section === "lawyer" && <LawyerForm />}
      {section === "info" && <InfoForm />}
    </div>
  );
};

export default AdminPanel;
