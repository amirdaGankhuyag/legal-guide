import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import firebase from "../utils/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Spinner from "../components/Spinner";

const Infos = () => {
  const [infos, setInfos] = useState([]);
  const [loading, setLoading] = useState(false);
  const storage = getStorage(firebase);

  useEffect(() => {
    const fetchInfos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("infos");
        const infos = response.data.data;
        const infosWithPhotos = await Promise.all(
          infos.map(async (info) => {
            if (info.photo) {
              const imagePath = `gs://legal-guide-2f523.firebasestorage.app/InfoPhotos/${info.photo}`;
              const photoRef = ref(storage, imagePath);
              const url = await getDownloadURL(photoRef);
              return { ...info, photo: url };
            }
            return info;
          }),
        );
        setInfos(infosWithPhotos);
      } catch (error) {
        console.error("Мэдээллийг татахад алдаа гарлаа", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfos();
  }, []);

  if (loading) return <Spinner />;
  return (
    <div className="bg-gray-100 px-4 py-2">
      <h3 className="font-code mb-4 ml-2 flex justify-center text-2xl font-bold">
        Мэдээлэл
      </h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {infos.map((info) => (
          <Link to={`/infos/${info._id}`} key={info._id}>
            <div
              key={info._id}
              className="overflow-hidden rounded-md bg-white shadow-md transition-transform hover:scale-105"
            >
              <img
                src={info.photo || "/default-info.jpg"}
                alt={info.title}
                loading="lazy"
                className="h-40 w-full"
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
