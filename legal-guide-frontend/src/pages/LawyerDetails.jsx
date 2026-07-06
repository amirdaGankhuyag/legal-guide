import { useState, useEffect, use } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { photoSrc } from "../utils/photo";
import Spinner from "../components/Spinner";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const LawyerDetails = () => {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      const response = await axios.get(`lawyers/${id}`);
      // Зураг backend-ээс photoUrl-ээр шууд ирнэ
      setLawyer(response.data.data);
    };
    fetchLawyerDetails();
  }, [id]);

  return (
    <div className="font-code m-3 mx-auto max-w-2xl rounded-md bg-white p-6 shadow-xl">
      {lawyer ? (
        <div className="flex flex-col items-center space-y-2">
          <img
            src={photoSrc(lawyer.photoUrl, "default-lawyer.jpg")}
            alt={lawyer.firstName}
            className="h-48 w-48 rounded-3xl border-2 border-blue-500 object-cover"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            {lawyer.firstName} {lawyer.lastName}
          </h1>
          <p className="font-medium text-blue-600">{lawyer.position}</p>
          <div className="mt-4 w-full space-y-2 text-left">
            <p>
              <span className="font-semibold">📞:</span> {lawyer.contact?.phone}
            </p>
            <p>
              <span className="font-semibold">📧:</span> {lawyer.contact?.email}
            </p>
            <p>
              <span className="font-semibold">📍 Ажлын хаяг:</span>{" "}
              {lawyer.workAddress}
            </p>
            <p className="font-semibold"> Үйлчилгээний чиглэл:</p>
            <ul className="list-inside list-disc text-gray-700">
              {lawyer.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
            <p>
              <span className="font-semibold">Танилцуулга:</span>{" "}
              {lawyer.introduction}
            </p>
            <p>
              <span className="font-semibold">Ажлын туршлага:</span>{" "}
              {lawyer.experience}
            </p>
          </div>
          <div className="mt-4 flex gap-4">
            {lawyer.contact?.facebookAcc && (
              <a
                href={`https://facebook.com/${lawyer.contact.facebookAcc}`}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                <FaFacebook size={25} />
              </a>
            )}
            {lawyer.contact?.instagramAcc && (
              <a
                href={`https://instagram.com/${lawyer.contact.instagramAcc}`}
                target="_blank"
                className="text-pink-500 hover:underline"
              >
                <FaInstagram size={25} />
              </a>
            )}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default LawyerDetails;
