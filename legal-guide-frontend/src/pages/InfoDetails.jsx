import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import firebase from "../utils/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Spinner from "../components/Spinner";

const InfoDetails = () => {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true); // анхдагч утга true
  const storage = getStorage(firebase);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`infos/${id}`);
        const infoData = response.data.data;

        if (infoData?.photo) {
          const imagePath = `InfoPhotos/${infoData.photo}`;
          const photoRef = ref(storage, imagePath);
          const url = await getDownloadURL(photoRef);
          setInfo({ ...infoData, photo: url });
        } else {
          setInfo(infoData);
        }
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
    return <p className="mt-4 text-center text-red-500">Мэдээлэл олдсонгүй</p>;
  }

  return (
    <div className="bg-gray-100 px-4 py-2">
      <h3 className="font-code mb-4 ml-2 flex justify-center text-2xl font-bold">
        {info.title}
      </h3>
      <div className="relative">
        <img
          src={info.photo || "/default-info.jpg"}
          alt={info.title}
          loading="lazy"
          className="h-40 w-full rounded-md object-cover shadow-sm"
        />
        <div className="absolute top-2 right-2 rounded bg-white/80 px-3 py-1 text-sm text-gray-700 shadow">
          🕒 Нийтэлсэн: {formatDate(info.createdAt)}
        </div>
      </div>
      <p className="mt-4 whitespace-pre-line text-gray-800">{info.content}</p>
    </div>
  );
};

export default InfoDetails;
