import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import firebase from "../utils/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Spinner from "../components/Spinner";
import Select from "react-select";

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const storage = getStorage(firebase);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [initLawyers, setInitLawyers] = useState([]);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("lawyers");
        const lawyers = response.data.data;
        const lawyersWithPhotos = await Promise.all(
          lawyers.map(async (lawyer) => {
            if (lawyer.photo && lawyer.photoUrl === "no-url") {
              const imagePath = `LawyerPhotos/${lawyer.photo}`;
              const photoRef = ref(storage, imagePath);
              const url = await getDownloadURL(photoRef);
              return { ...lawyer, photoUrl: url };
            }
            return lawyer;
          }),
        );
        setLawyers(lawyersWithPhotos);
        setInitLawyers(lawyersWithPhotos);

        const allServices = new Set();
        lawyersWithPhotos.forEach((lawyer) => {
          lawyer.services?.forEach((service) => allServices.add(service));
        });
        const options = Array.from(allServices).map((service) => ({
          value: service,
          label: service,
        }));
        setServiceOptions(options);
      } catch (error) {
        console.error("Хуульчдын мэдээллийг татахад алдаа гарлаа", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  const filterByService = (selected) => {
    setSelectedService(selected);
    if (selected) {
      const filteredLawyers = initLawyers.filter((lawyer) =>
        lawyer.services?.includes(selected.value),
      );
      setLawyers(filteredLawyers);
    } else {
      setLawyers(initLawyers);
    }
  };

  if (loading) return <Spinner />;
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-2">
      <h3 className="font-code mb-4 ml-2 flex justify-center text-2xl font-bold">
        Хуульчдын мэдээлэл
      </h3>
      <div className="mb-4 w-72">
        <Select
          options={serviceOptions}
          value={selectedService}
          onChange={filterByService}
          isClearable
          isSearchable
          placeholder="Үйлчилгээний чиглэлээр шүүх"
          className="font-code text-sm"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {lawyers.map((lawyer) => (
          <Link to={`/lawyers/${lawyer._id}`} key={lawyer._id}>
            <div className="transform overflow-hidden rounded-md bg-white shadow-lg transition duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={lawyer.photoUrl || "default-lawyer.jpg"}
                alt={lawyer.firstName}
                loading="lazy"
                className="h-40 w-full object-cover"
              />
              <div className="p-2">
                <h3 className="text-md font-semibold text-gray-800">
                  {lawyer.firstName} {lawyer.lastName}
                </h3>
                <p className="text-sm text-gray-600">{lawyer.position}</p>
              </div>
            </div>
          </Link>
        ))}
        {lawyers.length === 0 && (
          <div className="font-code col-span-full text-center text-gray-500">
            Хуульчид олдсонгүй
          </div>
        )}
      </div>
    </div>
  );
};

export default Lawyers;
