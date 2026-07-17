import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { photoSrc } from "../utils/photo";
import Spinner from "../components/Spinner";
import Markdown from "react-markdown";

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

  // хуучин: if (!info.length === 0) — (!info.length) === 0 гэж уншигдаад үргэлж false,
  // алдааны үед info=null тул доор info.title дээр app унадаг байсан
  if (!info) {
    return (
      <div className="font-code col-span-full text-center text-gray-500">
        Mэдээлэл олдсонгүй
      </div>
    );
  }

  return (
    // хуучин: px-50 (200px тал бүрд) — мобайл дээр агуулга бараг харагддаггүй байсан
    <div className="font-code min-h-screen bg-gray-100 px-4 py-7 md:px-20 xl:px-50">
      <h3 className="mb-4 ml-2 flex justify-center text-2xl font-bold">
        {info.title}
      </h3>
      <div className="relative">
        <img
          src={photoSrc(info.photoUrl, "/default-info.jpg")}
          alt={info.title}
          loading="lazy"
          className="h-55 w-full rounded-md object-cover shadow-sm"
        />
        <div className="absolute top-2 right-2 rounded bg-white/80 px-3 py-1 text-sm text-gray-700 shadow">
          🕒 Нийтэлсэн: {formatDate(info.createdAt)}
        </div>
      </div>
      <Markdown>{info.content}</Markdown>
    </div>
  );
};

export default InfoDetails;
