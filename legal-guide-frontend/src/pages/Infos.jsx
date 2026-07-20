import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import { photoSrc } from "../utils/photo";
import Spinner from "../components/Spinner";
import { FiFileText } from "react-icons/fi";

// Firms.jsx/Lawyers.jsx-тэй ижил indigo/slate дизайны системд шилжүүлэв

const Infos = () => {
  const [infos, setInfos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInfos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("infos");
        // Зургууд backend-ээс photoUrl-ээр шууд ирнэ
        setInfos(response.data.data);
      } catch (error) {
        console.error("Мэдээллийг татахад алдаа гарлаа", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfos();
  }, []);

  if (loading) return <Spinner />;
  if (infos.length === 0) {
    return (
      <div className="font-sans flex min-h-screen items-center justify-center bg-slate-50 text-center text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        Мэдээлэл олдсонгүй
      </div>
    );
  }
  return (
    <div className="font-sans min-h-screen bg-slate-50 px-4 py-8 md:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <FiFileText className="text-indigo-600 dark:text-indigo-400" />
          Мэдээллүүд
        </h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {infos.map((info) => (
            <Link to={`/infos/${info._id}`} key={info._id}>
              <div className="flex h-64 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <img
                  src={photoSrc(info.photoUrl, "/default-info.jpg")}
                  alt={info.title}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {info.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {info.summary}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Infos;
