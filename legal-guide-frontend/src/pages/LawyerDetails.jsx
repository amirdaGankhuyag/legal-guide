import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { photoSrc } from "../utils/photo";
import Spinner from "../components/Spinner";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin, FiTool } from "react-icons/fi";

// FirmDetails.jsx-тэй ижил indigo/slate дизайны системд шилжүүлэв

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
    <div className="font-sans min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {lawyer ? (
          <div className="flex flex-col items-center">
            <img
              src={photoSrc(lawyer.photoUrl, "/default-lawyer.jpg")}
              alt={lawyer.firstName}
              className="h-32 w-32 rounded-full border-4 border-indigo-100 object-cover dark:border-indigo-950/50"
            />
            <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
              {lawyer.firstName} {lawyer.lastName}
            </h1>
            <p className="font-medium text-indigo-600 dark:text-indigo-400">
              {lawyer.position}
            </p>

            <div className="mt-6 w-full space-y-2 text-left text-slate-600 dark:text-slate-400">
              {lawyer.contact?.phone && (
                <p className="flex items-center gap-2">
                  <FiPhone className="shrink-0 text-indigo-600 dark:text-indigo-400" />
                  {lawyer.contact.phone}
                </p>
              )}
              {lawyer.contact?.email && (
                <p className="flex items-center gap-2">
                  <FiMail className="shrink-0 text-indigo-600 dark:text-indigo-400" />
                  {lawyer.contact.email}
                </p>
              )}
              {lawyer.workAddress && (
                <p className="flex items-start gap-2">
                  <FiMapPin className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  {lawyer.workAddress}
                </p>
              )}
            </div>

            {lawyer.services?.length > 0 && (
              <div className="mt-6 w-full">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <FiTool className="text-indigo-600 dark:text-indigo-400" />
                  Үйлчилгээний чиглэл
                </h2>
                <div className="flex flex-wrap gap-2">
                  {lawyer.services.map((service, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {lawyer.introduction && (
              <div className="mt-6 w-full text-left">
                <h2 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">
                  Танилцуулга
                </h2>
                <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                  {lawyer.introduction}
                </p>
              </div>
            )}

            {lawyer.experience && (
              <div className="mt-4 w-full text-left">
                <h2 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">
                  Ажлын туршлага
                </h2>
                <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                  {lawyer.experience}
                </p>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              {lawyer.contact?.facebookAcc && (
                <a
                  href={`https://facebook.com/${lawyer.contact.facebookAcc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <FaFacebook size={22} />
                </a>
              )}
              {lawyer.contact?.instagramAcc && (
                <a
                  href={`https://instagram.com/${lawyer.contact.instagramAcc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <FaInstagram size={22} />
                </a>
              )}
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default LawyerDetails;
