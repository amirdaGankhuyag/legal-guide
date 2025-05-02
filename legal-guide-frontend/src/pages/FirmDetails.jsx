import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import firebase from "../utils/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Spinner from "../components/Spinner";

const FirmDetails = () => {
  const { id } = useParams();
  const [firm, setFirm] = useState(null);
  const storage = getStorage(firebase);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchFirmDetails = async () => {
      const response = await axios.get(`firms/${id}`);
      const firmData = response.data.data;
      if (firmData.photo && firmData.photoUrl === "no-url") {
        try {
          const imagePath = `gs://legal-guide-2f523.firebasestorage.app/FirmPhotos/${firmData.photo}`;
          const photoRef = ref(storage, imagePath);
          const url = await getDownloadURL(photoRef);
          setPhotoUrl(url);
        } catch (err) {
          console.error("Зургийг татахад алдаа гарлаа", err);
          setPhotoUrl(null);
        }
      }
      if (firmData.photoUrl !== "no-url") {
        setPhotoUrl(firmData.photoUrl);
      }
      setFirm(firmData);
    };
    fetchFirmDetails();
  }, [id]);

  if (firm?.length === 0) {
    return (
      <div className="font-code col-span-full text-center text-gray-500">
        Фирм олдсонгүй
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      {firm ? (
        <div className="font-code w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
          {photoUrl && (
            <img
              src={photoUrl}
              alt={firm.name}
              className="h-64 w-full object-cover"
              loading="lazy"
            />
          )}
          
          <div className="space-y-4 p-6">
            <h1 className="text-3xl font-bold text-gray-900">{firm.name}</h1>
            <p className="text-gray-600">
              <strong>📍 Хаяг:</strong> {firm.address}
            </p>
            {firm.description && (
              <p className="text-gray-700">{firm.description}</p>
            )}

            {firm.services?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  🛠 Үйлчилгээ
                </h2>
                <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                  {firm.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
            )}

            {firm.contact && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  📞 Холбоо барих
                </h2>
                <p className="mt-1 text-gray-700">Утас: {firm.contact.phone}</p>
                <p className="text-gray-700">И-мэйл: {firm.contact.email}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default FirmDetails;
