import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import leaflet from "leaflet";
import { myLocation } from "../assets";
import Button from "../components/Button";

const Firms = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [view, setView] = useState("map");

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
        timeout: 2000, // Хугацаа хэтэрсэн тохиолдолд алдаа гарна.
      },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (
      lat1 === undefined ||
      lon1 === undefined ||
      lat2 === undefined ||
      lon2 === undefined
    ) {
      console.warn(
        "Хоорондын зайн тооцоолох координатууд буруу байна",
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

  const renderMapView = () => {
    return (
      <>
        {userLocation && (
          <MapContainer
            center={[userLocation.latitude, userLocation.longitude]}
            zoom={14}
            style={{ height: "400px", width: "100%" }}
            scrollWheelZoom={true}
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
          </MapContainer>
        )}
      </>
    );
  };

  const renderListView = () => {
    return (
      <>
        <div>List view</div>
      </>
    );
  };

  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold">Тантай ойрхон хуулийн фирмүүд</h3>
      {userLocation ? (
        <>
          <div>
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
        <div>Байршлыг ачааллаж байна...</div>
      )}
    </div>
  );
};

export default Firms;
