import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import leaflet from "leaflet";
import { myLocation, firmLocation } from "../assets";
import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios";
import Spinner from "../components/spinner";
import Button from "../components/Button";

const Firms = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [sortedFirms, setSortedFirms] = useState([]);
  const [view, setView] = useState("map");
  const navigate = useNavigate();

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
        enableHighAccuracy: true, // GPS-ийг ашиглахыг зөвшөөрнө.
        maximumAge: 0, // Хадгалагдсан байршлыг ашиглахыг зөвшөөрөхгүй.
        timeout: 5000, // Хугацаа хэтэрсэн тохиолдолд алдаа гарна.
      },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

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
      return response.data.data;
    },
    enabled: !!userLocation,
    staleTime: 1000 * 60 * 5, // 5 минут
    cacheTime: 1000 * 60 * 30, // 30 минут
  });

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

  const renderMapView = () => {
    if (isLoading) return <Spinner />;
    return (
      <div className="mb-3 flex flex-col items-center justify-center">
        {userLocation && (
          <MapContainer
            center={[userLocation.latitude, userLocation.longitude]}
            zoom={15}
            style={{
              height: "520px",
              width: "90%",
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
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedFirms.map((firm) => (
          <Link to={`/firms/${firm._id}`} key={firm._id}>
            <li className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105">
              <img
                src={firm.photo || "/default-firm.jpg"}
                alt={firm.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {firm.name}
                </h3>
                <p className="text-gray-600">{firm.address}</p>
                <p className="font-medium text-blue-600">
                  Зай: {firm.distance.toFixed(2)} км
                </p>
              </div>
            </li>
          </Link>
        ))}
        {sortedFirms.length === 0 && (
          <li className="text-center text-gray-500">
            Хуулийн фирмүүд олдсонгүй
          </li>
        )}
      </ul>
    );
  };

  return (
    <div>
      <h3 className="mb-4 ml-2 text-2xl font-bold">
        Тантай ойрхон хуулийн фирмүүд
      </h3>
      {userLocation ? (
        <>
          <div className="mb-4 ml-2 flex gap-2">
            <Button onClick={() => setView("list")} black>
              Жагсаалтаар харах
            </Button>
            <Button onClick={() => setView("map")} black>
              Газрын зураг дээр харах
            </Button>
          </div>
          {view === "list" ? renderListView() : renderMapView()}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Firms;
