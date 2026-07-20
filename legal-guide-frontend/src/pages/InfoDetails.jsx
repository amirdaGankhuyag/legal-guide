import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { photoSrc } from "../utils/photo";
import Spinner from "../components/Spinner";
import Markdown from "react-markdown";
import { FiClock } from "react-icons/fi";

// Firms/LawyerDetails-тэй ижил indigo/slate дизайны системд шилжүүлэв

const InfoDetails = () => {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true); // анхдагч утга true

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`infos/${id}`);
        // Зураг backend-ээс photoUrl-ээр шууд ирнэ
        setInfo(response.data.data);
      } catch (error) {
        console.error("Мэдээллийг татахад алдаа гарлаа", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInfo();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month} сарын ${day}, ${year}`;
  };

  if (loading) return <Spinner />;

  if (!info) {
    return (
      <div className="font-sans flex min-h-screen items-center justify-center bg-slate-50 text-center text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        Mэдээлэл олдсонгүй
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative">
          <img
            src={photoSrc(info.photoUrl, "/default-info.jpg")}
            alt={info.title}
            loading="lazy"
            className="h-56 w-full object-cover md:h-72"
          />
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-200">
            <FiClock className="text-indigo-600 dark:text-indigo-400" />
            {formatDate(info.createdAt)}
          </div>
        </div>
        <div className="p-6 md:p-8">
          <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
            {info.title}
          </h1>
          <div className="prose prose-slate dark:prose-invert max-w-none leading-relaxed text-slate-600 dark:text-slate-400">
            <Markdown>{info.content}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoDetails;
