import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { photoSrc } from "../utils/photo";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const FirmDetails = () => {
  const { id } = useParams();
  const [firm, setFirm] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { isAuth, isAdmin } = useAuth();

  useEffect(() => {
    const fetchFirmDetails = async () => {
      const response = await axios.get(`firms/${id}`);
      const firmData = response.data.data;
      // Зураг backend-ээс photoUrl-ээр шууд ирнэ
      setPhotoUrl(photoSrc(firmData.photoUrl));
      setFirm(firmData);
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
    } catch (error) {
      console.error("Comment delete error:", error);
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

  if (firm?.length === 0) {
    return (
      <div className="font-code col-span-full text-center text-gray-500">
        Фирм олдсонгүй
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      {firm ? (
        <div className="font-code w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
          {photoUrl && (
            <img
              src={photoUrl}
              alt={firm.name}
              className="h-64 w-full object-cover"
              loading="lazy"
            />
          )}

          <div className="space-y-4 p-6">
            <h1 className="text-3xl font-bold text-gray-900">{firm.name}</h1>
            <p className="text-gray-600">
              <strong>📍 Хаяг:</strong> {firm.address}
            </p>
            {firm.description && (
              <p className="text-gray-700">{firm.description}</p>
            )}

            {firm.services?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  🛠 Үйлчилгээ
                </h2>
                <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                  {firm.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
            )}

            {firm.contact && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  📞 Холбоо барих
                </h2>
                <p className="mt-1 text-gray-700">Утас: {firm.contact.phone}</p>
                <p className="text-gray-700">И-мэйл: {firm.contact.email}</p>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800">Сэтгэгдэл</h2>
              {isAuth ? (
                <form onSubmit={handleCommentSubmit} className="mt-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Сэтгэгдэл бичих..."
                    className="w-full rounded border p-2"
                    rows="3"
                  />
                  <Button type="submit" black>
                    Илгээх
                  </Button>
                </form>
              ) : (
                <p className="text-gray-600">
                 Сэтгэгдэл бичихийн тулд эхлээд нэвтэрнэ үү.
                </p>
              )}
              <div className="mt-4 space-y-2">
                {comments.map((comment) => (
                  <div key={comment._id} className="rounded bg-gray-50 p-2">
                    <div className="flex items-start justify-between">
                      <p className="font-semibold">{comment.username}</p>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleCommentDelete(comment._id)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Устгах
                        </button>
                      )}
                    </div>
                    <p>{comment.comment}</p>
                    <p className="text-sm text-gray-500">
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
