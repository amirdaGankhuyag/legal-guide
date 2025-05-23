import { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import leaflet from "leaflet";
import { myLocation, firmLocation } from "../assets";
import { useQuery } from "@tanstack/react-query";
import firebase from "../utils/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import axios from "../utils/axios";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import Select from "react-select";

const Firms = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [sortedFirms, setSortedFirms] = useState([]);
  const [view, setView] = useState("list");
  const storage = getStorage(firebase);
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
      const firms = response.data.data;

      const firmsWithPhotos = await Promise.all(
        firms.map(async (firm) => {
          if (firm.photo && firm.photoUrl === "no-url") {
            try {
              const photoRef = ref(storage, `FirmPhotos/${firm.photo}`);
              const url = await getDownloadURL(photoRef);
              return { ...firm, photoUrl: url };
            } catch (err) {
              console.error("Зургийг татахад алдаа гарлаа", err);
              return firm;
            }
          }
          return firm;
        }),
      );
      return firmsWithPhotos;
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

      // Firebase-оос зураг татах хэсэг
      const firmsWithPhotos = await Promise.all(
        firms.map(async (firm) => {
          if (firm.photo && firm.photoUrl === "no-url") {
            try {
              const photoRef = ref(storage, `FirmPhotos/${firm.photo}`);
              const url = await getDownloadURL(photoRef);
              return { ...firm, photoUrl: url };
            } catch (err) {
              console.error("Зураг авахад алдаа:", err);
              return firm;
            }
          }
          return firm;
        }),
      );

      setAllFirms(firmsWithPhotos);
      setFilteredFirms(firmsWithPhotos);

      // services-оос option жагсаалт гаргах
      const allServices = new Set();
      firmsWithPhotos.forEach((firm) => {
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
        console.log(latitude, longitude);
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

  const renderContent = () => {
    if (view === "all") return renderAllFirmsView();
    if (view === "map") return renderMapView();
    if (view === "list") return renderListView();
  };

  const renderAllFirmsView = () => {
    if (isAllFirmsLoading) return <Spinner />;
    if (!allFirms || allFirms.length === 0) {
      return <div className="text-center text-gray-500">Фирм олдсонгүй</div>;
    }

    return (
      <div className="flex flex-col items-end justify-center">
        <div className="mb-4 w-64">
          <Select
            options={serviceOptions}
            value={selectedService}
            onChange={filterByService}
            isClearable
            isSearchable
            placeholder="Үйлчилгээний төрлөөр шүүх"
            className="font-code text-sm"
          />
        </div>
        <ul className="font-code grid min-h-screen grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {filteredFirms.map((firm) => (
            <Link to={`/firms/${firm._id}`} key={firm._id}>
              <li className="flex h-64 flex-col overflow-hidden rounded-md bg-white shadow-md transition-transform hover:scale-105">
                <img
                  src={firm.photoUrl || "default-firm.jpg"}
                  alt={firm.name}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
                <div className="flex flex-col p-2">
                  <h3 className="text-md font-semibold text-gray-800">
                    {firm.name}
                  </h3>
                  <p className="text-sm text-gray-600">{firm.address}</p>
                </div>
              </li>
            </Link>
          ))}
          {filteredFirms.length === 0 && (
            <li className="col-span-full text-center text-gray-500">
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
          <MapContainer
            center={[userLocation.latitude, userLocation.longitude]}
            zoom={15}
            style={{
              height: "510px",
              width: "95%",
              borderRadius: "5px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
              border: "1px solid #ccc",
            }}
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
                // eventHandlers={{
                //   click: () => {
                //     console.log("Marker clicked", firm.name);
                //   },
                // }}
              >
                <Popup>
                  <div>
                    <p>{firm.name}</p>
                    <a href={`/firms/${firm._id}`}>Дэлгэрэнгүй</a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    );
  };

  const renderListView = () => {
    if (isLoading) return <Spinner />;
    return (
      <ul className="font-code grid min-h-screen grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {sortedFirms.map((firm) => (
          <Link to={`/firms/${firm._id}`} key={firm._id}>
            <li className="flex h-64 flex-col overflow-hidden rounded-md bg-white shadow-md transition-transform hover:scale-105">
              <img
                src={firm.photoUrl || "default-firm.jpg"}
                alt={firm.name}
                loading="lazy" // // Native lazy loading
                className="h-40 w-full object-cover"
              />
              <div className="flex flex-col p-2">
                <h3 className="text-md font-semibold text-gray-800">
                  {firm.name}
                  {" - "}
                  <span className="font-medium text-blue-600">
                    {firm.distance.toFixed(2)} км
                  </span>
                </h3>
                <p className="text-sm text-gray-600">{firm.address}</p>
              </div>
            </li>
          </Link>
        ))}
        {sortedFirms.length === 0 && (
          <li className="font-code col-span-full text-center text-gray-500">
            Хуулийн фирмүүд олдсонгүй
          </li>
        )}
      </ul>
    );
  };

  return (
    <div className="bg-gray-100 px-4 py-2">
      <h3 className="font-code mb-4 ml-2 flex justify-start text-2xl font-bold">
        Тантай ойрхон хуулийн фирмүүд
      </h3>
      {userLocation ? (
        <>
          <div className="mb-4 ml-2 flex items-center justify-between">
            <div className="flex gap-5">
              <Button onClick={() => setView("list")} black>
                Жагсаалтаар харах
              </Button>
              <Button onClick={() => setView("map")} black>
                Газрын зураг дээр харах
              </Button>
            </div>
            <div>
              <Button onClick={() => setView("all")} black>
                Бүх фирмүүд
              </Button>
            </div>
          </div>
          {renderContent()}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Firms;
