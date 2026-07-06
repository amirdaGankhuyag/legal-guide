import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import { photoSrc } from "../utils/photo";
import Spinner from "../components/Spinner";

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
  if (!infos.length === 0) {
    return (
      <div className="font-code col-span-full text-center text-gray-500">
        Мэдээлэл олдсонгүй
      </div>
    );
  }
  return (
    <div className="font-code min-h-screen bg-gray-100 px-4 py-2">
      <h3 className="mb-4 ml-2 flex justify-center text-2xl font-bold">
        Мэдээллүүд
      </h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {infos.map((info) => (
          <Link to={`/infos/${info._id}`} key={info._id}>
            <div
              key={info._id}
              className="h-60 overflow-hidden rounded-md bg-white shadow-md transition-transform hover:scale-105"
            >
              <img
                src={photoSrc(info.photoUrl, "/default-info.jpg")}
                alt={info.title}
                loading="lazy"
                className="h-40 w-full object-cover"
              />
              <div className="p-2">
                <h3 className="text-md font-semibold text-gray-800">
                  {info.title}
                </h3>
                <p className="text-sm text-gray-600">{info.summary}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Infos;
