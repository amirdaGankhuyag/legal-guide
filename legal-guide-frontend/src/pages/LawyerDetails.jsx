import { useState, useEffect, use } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import firebase from "../utils/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Spinner from "../components/Spinner";

const LawyerDetails = () => {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const storage = getStorage(firebase);

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      const response = await axios.get(`lawyers/${id}`);
      if (response.data.data.photo) {
        const imagePath = `gs://legal-guide-2f523.firebasestorage.app/LawyerPhotos/${response.data.data.photo}`;
        const photoRef = ref(storage, imagePath);
        const url = await getDownloadURL(photoRef);
        setLawyer({ ...response.data.data, photo: url });
      } else {
        setLawyer(response.data.data);
      }
    };
    fetchLawyerDetails();
  }, [id]);

  return (
    <div>
      {lawyer ? (
        <div className="font-code flex flex-col items-center">
          <h1 className="text-2xl font-bold">{lawyer.firstName}</h1>
          {lawyer.photo && (
            <img
              src={lawyer.photo}
              alt={lawyer.firstName}
              className="h-auto w-1/2"
              loading="lazy"
            />
          )}
          <p>Хаяг: {lawyer.workAddress}</p>
          <p>Утас: {lawyer.phone}</p>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default LawyerDetails;
