import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import leaflet from "leaflet";
import { myLocation, firmLocation } from "../assets";
import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios";
import { photoSrc } from "../utils/photo";
import { selectClassNames } from "../utils/selectStyles";
import Spinner from "../components/Spinner";
import Select from "react-select";
import { FiMapPin } from "react-icons/fi";

// Хуучин bg-gray-100/font-code загварыг Home/Login-той нэг indigo/slate
// дизайны системд шилжүүлж, товчнуудыг segmented control болгов.

const Firms = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [sortedFirms, setSortedFirms] = useState([]);
  const [view, setView] = useState("list");
  const [allFirms, setAllFirms] = useState([]);
  const [filteredFirms, setFilteredFirms] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isAllFirmsLoading, setIsAllFirmsLoading] = useState(false);

  const { data: firmsData = [], isLoading } = useQuery({
    queryKey: ["firms", userLocation],
    queryFn: async ({ queryKey }) => {
      const userLocation = queryKey[1];
      if (!userLocation) return [];

      const { latitude, longitude } = userLocation;
      const response = await axios.get("firms", {
        params: {
          latMin: latitude - 0.1,
          latMax: latitude + 0.1,
          lonMin: longitude - 0.1,
          lonMax: longitude + 0.1,
        },
      });
      // Зургууд backend-ээс photoUrl-ээр шууд ирнэ
      return response.data.data;
    },
    enabled: !!userLocation, // Байршил олдсон үед л асна
    staleTime: 1000 * 60 * 1, // 1 минут шинэчлэхгүй
    cacheTime: 1000 * 60 * 3, // 3 минут кэшлэнэ
  });

  const fetchAllFirms = async () => {
    setIsAllFirmsLoading(true);
    try {
      const res = await axios.get("firms/all");
      const firms = res.data.data || [];

      setAllFirms(firms);
      setFilteredFirms(firms);

      // services-оос option жагсаалт гаргах
      const allServices = new Set();
      firms.forEach((firm) => {
        firm.services?.forEach((service) => allServices.add(service));
      });

      const options = Array.from(allServices).map((s) => ({
        value: s,
        label: s,
      }));
      setServiceOptions(options);
    } catch (err) {
      console.error("firms/all татахад алдаа:", err);
    } finally {
      setIsAllFirmsLoading(false);
    }
  };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error("Байршлыг авахад алдаа гарлаа", error);
        setUserLocation({ latitude: 47.918834, longitude: 106.917601 });
      },
      {
        enableHighAccuracy: true, // Байршлыг өндөр нарийвлалтай авна.
        maximumAge: 1000 * 60 * 1, // Хадгалагдсан байршлыг 1 минутын турш ашиглана.
        timeout: 1000 * 5, // 5 секундын турш байршлын мэдээллийг авахыг оролдоно.
      },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (userLocation && firmsData.length > 0) {
      const firmsWithDistance = firmsData.map((firm) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          firm.location.latitude,
          firm.location.longitude,
        );
        return {
          ...firm,
          distance,
        };
      });
      const sortedFirms = firmsWithDistance.sort(
        (a, b) => a.distance - b.distance,
      );
      setSortedFirms(sortedFirms);
    }
  }, [userLocation, firmsData]);

  useEffect(() => {
    fetchAllFirms();
  }, [allFirms.length]);

  const filterByService = (selected) => {
    setSelectedService(selected);
    if (!selected) {
      setFilteredFirms(allFirms);
    } else {
      const filtered = allFirms.filter((firm) =>
        firm.services?.includes(selected.value),
      );
      setFilteredFirms(filtered);
    }
  };

  // Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (
      lat1 === undefined ||
      lon1 === undefined ||
      lat2 === undefined ||
      lon2 === undefined
    ) {
      console.warn(
        "Хоорондын зай тооцоолох координатууд буруу байна",
        lat1,
        lon1,
        lat2,
        lon2,
      );
      return null;
    }
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const locationIcon = leaflet.icon({
    iconUrl: myLocation,
    iconSize: [20, 20],
    iconAnchor: [12, 20],
    popupAnchor: [1, -34],
    shadowSize: [30, 30],
  });

  const firmIcon = leaflet.icon({
    iconUrl: firmLocation,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [1, -34],
    shadowSize: [30, 30],
  });

  // Фирмийн жагсаалтын карт (renderListView, renderAllFirmsView хоёуланд ашиглана)
  const FirmCard = ({ firm, distanceKm }) => (
    <Link to={`/firms/${firm._id}`}>
      <div className="flex h-64 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <img
          src={photoSrc(firm.photoUrl, "/default-firm.jpg")}
          alt={firm.name}
          loading="lazy"
          className="h-40 w-full object-cover"
        />
        <div className="flex flex-col p-3">
          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {firm.name}
            {distanceKm != null && (
              <span className="ml-1 font-medium text-indigo-600 dark:text-indigo-400">
                · {distanceKm.toFixed(2)} км
              </span>
            )}
          </h3>
          <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
            {firm.address}
          </p>
        </div>
      </div>
    </Link>
  );

  const renderContent = () => {
    if (view === "all") return renderAllFirmsView();
    if (view === "map") return renderMapView();
    if (view === "list") return renderListView();
  };

  const renderAllFirmsView = () => {
    if (isAllFirmsLoading) return <Spinner />;
    if (!allFirms || allFirms.length === 0) {
      return (
        <div className="text-center text-slate-500 dark:text-slate-400">
          Фирм олдсонгүй
        </div>
      );
    }

    return (
      <div className="flex flex-col items-end justify-center">
        <div className="mb-4 w-64">
          <Select
            unstyled
            classNames={selectClassNames}
            options={serviceOptions}
            value={selectedService}
            onChange={filterByService}
            isClearable
            isSearchable
            placeholder="Үйлчилгээний төрлөөр шүүх"
          />
        </div>
        <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {filteredFirms.map((firm) => (
            <li key={firm._id}>
              <FirmCard firm={firm} />
            </li>
          ))}
          {filteredFirms.length === 0 && (
            <li className="col-span-full text-center text-slate-500 dark:text-slate-400">
              Сонгосон үйлчилгээнд тохирох фирм олдсонгүй
            </li>
          )}
        </ul>
      </div>
    );
  };

  const renderMapView = () => {
    if (isLoading) return <Spinner />;
    return (
      <div className="mb-3 flex flex-col items-center justify-center">
        {userLocation && (
          <div className="w-[95%] overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
            <MapContainer
              center={[userLocation.latitude, userLocation.longitude]}
              zoom={15}
              style={{ height: "60vh", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[userLocation.latitude, userLocation.longitude]}
                icon={locationIcon}
              >
                <Popup>Таны байршил</Popup>
              </Marker>
              {sortedFirms.map((firm) => (
                <Marker
                  key={firm._id}
                  position={[firm.location.latitude, firm.location.longitude]}
                  icon={firmIcon}
                >
                  <Popup>
                    <div>
                      <p>{firm.name}</p>
                      <Link
                        to={`/firms/${firm._id}`}
                        className="text-indigo-600"
                      >
                        Дэлгэрэнгүй
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    );
  };

  const renderListView = () => {
    if (isLoading) return <Spinner />;
    return (
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {sortedFirms.map((firm) => (
          <li key={firm._id}>
            <FirmCard firm={firm} distanceKm={firm.distance} />
          </li>
        ))}
        {sortedFirms.length === 0 && (
          <li className="col-span-full text-center text-slate-500 dark:text-slate-400">
            Хуулийн фирмүүд олдсонгүй
          </li>
        )}
      </ul>
    );
  };

  return (
    <div className="font-sans min-h-screen bg-slate-50 px-4 py-8 md:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <FiMapPin className="text-indigo-600 dark:text-indigo-400" />
          Тантай ойрхон хуулийн фирмүүд
        </h1>
        {userLocation ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              {/* Segmented control: жагсаалт/газрын зураг сэлгэх */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                {[
                  { key: "list", label: "Жагсаалт" },
                  { key: "map", label: "Газрын зураг" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setView(tab.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      view === tab.key
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setView("all")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  view === "all"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                Бүх фирмүүд
              </button>
            </div>
            {renderContent()}
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default Firms;
