import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import firebase from "../utils/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Spinner from "../components/spinner";

const FirmDetails = () => {
  const { id } = useParams();
  const [firm, setFirm] = useState(null);
  const storage = getStorage(firebase);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchFirmDetails = async () => {
      const response = await axios.get(`firms/${id}`);
      if (response.data.data.photo) {
        const photoRef = ref(storage, response.data.data.photo);
        const url = await getDownloadURL(photoRef);
        setPhotoUrl(url);
      }
      setFirm(response.data.data);
      console.log(response.data.data);
    };
    fetchFirmDetails();
  }, [id]);

  return (
    <div>
      {firm ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">{firm.name}</h1>
          {photoUrl && (
            <img src={photoUrl} alt={firm.name} className="h-auto w-1/2" />
          )}
          <p>Хаяг: {firm.address}</p>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default FirmDetails;
