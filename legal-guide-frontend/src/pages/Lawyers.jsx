import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import { photoSrc } from "../utils/photo";
import { selectClassNames } from "../utils/selectStyles";
import Spinner from "../components/Spinner";
import Select from "react-select";
import { FiUsers } from "react-icons/fi";

// Firms.jsx-тэй ижил indigo/slate дизайны системд шилжүүлэв

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [initLawyers, setInitLawyers] = useState([]);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("lawyers");
        // Зургууд backend-ээс photoUrl-ээр шууд ирнэ
        const lawyers = response.data.data;
        setLawyers(lawyers);
        setInitLawyers(lawyers);

        const allServices = new Set();
        lawyers.forEach((lawyer) => {
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
    <div className="font-sans min-h-screen bg-slate-50 px-4 py-8 md:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <FiUsers className="text-indigo-600 dark:text-indigo-400" />
          Хуульчдын мэдээлэл
        </h1>
        <div className="mb-6 w-72">
          <Select
            unstyled
            classNames={selectClassNames}
            options={serviceOptions}
            value={selectedService}
            onChange={filterByService}
            isClearable
            isSearchable
            placeholder="Үйлчилгээний чиглэлээр шүүх"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {lawyers.map((lawyer) => (
            <Link to={`/lawyers/${lawyer._id}`} key={lawyer._id}>
              <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <img
                  src={photoSrc(lawyer.photoUrl, "/default-lawyer.jpg")}
                  alt={lawyer.firstName}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {lawyer.firstName} {lawyer.lastName}
                  </h3>
                  <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                    {lawyer.position}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {lawyers.length === 0 && (
            <div className="col-span-full text-center text-slate-500 dark:text-slate-400">
              Хуульчид олдсонгүй
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lawyers;
