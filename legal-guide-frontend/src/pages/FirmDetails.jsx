import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/axios";
import { photoSrc } from "../utils/photo";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiTool,
} from "react-icons/fi";

// Хуучин "shadow-2xl + голлуулсан layout" загварыг Home/Login-той нэг
// indigo/slate дизайны системд шилжүүлж, сэтгэгдлийн хэсгийг сайжруулав.

const FirmDetails = () => {
  const { id } = useParams();
  const [firm, setFirm] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(false);
  const { isAuth, isAdmin, userId } = useAuth();

  useEffect(() => {
    const fetchFirmDetails = async () => {
      try {
        const response = await axios.get(`firms/${id}`);
        const firmData = response.data.data;
        // Зураг backend-ээс photoUrl-ээр шууд ирнэ
        setPhotoUrl(photoSrc(firmData.photoUrl));
        setFirm(firmData);
      } catch (err) {
        console.error("Фирмийн мэдээлэл татахад алдаа гарлаа", err);
        setError(true);
      }
    };
    fetchFirmDetails();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`firms/${id}/comments`);
        setComments(response.data.data);
      } catch (error) {
        console.error("Comments fetch error:", error);
      }
    };
    fetchComments();
  }, [id]);

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`firms/${id}/comments/${commentId}`);
      setComments(comments.filter((comment) => comment._id !== commentId));
      toast.success("Амжилттай устгагдлаа.");
    } catch (error) {
      console.error("Comment delete error:", error);
      toast.error(error.response?.data?.error || "Устгахад алдаа гарлаа");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(`firms/${id}/comments`, {
        comment: newComment,
      });
      setComments([...comments, response.data.data]);
      setNewComment("");
    } catch (error) {
      console.error("Comment submission error:", error);
    }
  };

  if (error) {
    return (
      <div className="font-sans flex min-h-screen items-center justify-center bg-slate-50 text-center text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        Фирм олдсонгүй
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      {firm ? (
        <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {photoUrl && (
            <img
              src={photoUrl}
              alt={firm.name}
              className="h-64 w-full object-cover md:h-80"
              loading="lazy"
            />
          )}

          <div className="space-y-5 p-6 md:p-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {firm.name}
            </h1>
            <p className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
              <FiMapPin className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
              {firm.address}
            </p>
            {firm.description && (
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                {firm.description}
              </p>
            )}

            {firm.services?.length > 0 && (
              <div>
                <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <FiTool className="text-indigo-600 dark:text-indigo-400" />
                  Үйлчилгээ
                </h2>
                <div className="flex flex-wrap gap-2">
                  {firm.services.map((service, index) => (
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

            {firm.contact && (
              <div>
                <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  Холбоо барих
                </h2>
                <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                  {firm.contact.phone && (
                    <p className="flex items-center gap-2">
                      <FiPhone className="text-indigo-600 dark:text-indigo-400" />
                      {firm.contact.phone}
                    </p>
                  )}
                  {firm.contact.email && (
                    <p className="flex items-center gap-2">
                      <FiMail className="text-indigo-600 dark:text-indigo-400" />
                      {firm.contact.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <FiMessageSquare className="text-indigo-600 dark:text-indigo-400" />
                Сэтгэгдэл
              </h2>
              {isAuth ? (
                <form onSubmit={handleCommentSubmit} className="space-y-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Сэтгэгдэл бичих..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    rows="3"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                  >
                    Илгээх
                  </button>
                </form>
              ) : (
                <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
                  Сэтгэгдэл бичихийн тулд{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    эхлээд нэвтэрнэ үү
                  </Link>
                  .
                </p>
              )}
              <div className="mt-4 space-y-2">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {comment.username}
                      </p>
                      {/* Admin бүх сэтгэгдлийг, хэрэглэгч зөвхөн өөрийнхөө сэтгэгдлийг устгана */}
                      {(isAdmin || comment.user === userId) && (
                        <button
                          type="button"
                          onClick={() => handleCommentDelete(comment._id)}
                          className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Устгах
                        </button>
                      )}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {comment.comment}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {new Date(comment.date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default FirmDetails;
