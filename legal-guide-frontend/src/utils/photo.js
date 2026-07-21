// Одоо ашиглаж буй API-ийн үндсэн хаяг (axios.js-тэй ижил логик)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1/";

// Зургийн URL-ыг шалгаж, ашиглах боломжгүй бол fallback буцаана.
export const photoSrc = (photoUrl, fallback = null) => {
  if (
    !photoUrl ||
    photoUrl === "no-url" ||
    photoUrl.includes("firebasestorage")
  ) {
    return fallback;
  }
  // return photoUrl;
  // Хадгалагдсан URL хуучин domain-тэй (localhost, хуучин Render нэр) байж
  // болзошгүй тул /api/v1/-ээс хойшхи замыг одоогийн API хаягтай залгана
  const idx = photoUrl.indexOf("/api/v1/");
  if (idx !== -1) {
    return API_BASE + photoUrl.slice(idx + "/api/v1/".length);
  }
  return photoUrl;
};
