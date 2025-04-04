import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import firebase from "../utils/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Spinner from "../components/Spinner";

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const storage = getStorage(firebase);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("lawyers");
        const lawyers = response.data.data;
        const lawyersWithPhotos = await Promise.all(
          lawyers.map(async (lawyer) => {
            if (lawyer.photo) {
              const imagePath = `gs://legal-guide-2f523.firebasestorage.app/LawyerPhotos/${lawyer.photo}`;
              const photoRef = ref(storage, imagePath);
              const url = await getDownloadURL(photoRef);
              return { ...lawyer, photo: url };
            }
            return lawyer;
          }),
        );
        setLawyers(lawyersWithPhotos);
      } catch (error) {
        console.error("Хуульчдын мэдээллийг татахад алдаа гарлаа", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  if (loading) return <Spinner />;
  return (
    <div className="bg-gray-100 px-4 py-2">
      <h3 className="font-code mb-4 ml-2 flex justify-center text-2xl font-bold">
        Хуулийн зөвлөхүүд
      </h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {lawyers.map((lawyer) => (
          <Link to={`/lawyers/${lawyer._id}`} key={lawyer._id}>
            <div
              key={lawyer._id}
              className="overflow-hidden rounded-md bg-white shadow-md transition-transform hover:scale-105"
            >
              <img
                src={lawyer.photo || "/default-lawyer.jpg"}
                alt={lawyer.firsName}
                loading="lazy"
                className="h-40 w-full"
              />
              <div className="p-2">
                <h3 className="text-md font-semibold text-gray-800">
                  {lawyer.firstName}
                  {" - "}
                  <span className="font-medium text-blue-600">
                    {lawyer.email}
                  </span>
                </h3>
                <p className="text-sm text-gray-600">{lawyer.phone}</p>
              </div>
            </div>
          </Link>
        ))}
        {lawyers.length === 0 && (
          <div className="font-code col-span-full text-center text-gray-500">
            Хуулийн зөвлөхүүд олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
};

export default Lawyers;
