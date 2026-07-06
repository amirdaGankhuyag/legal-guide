// Зургийн URL-ыг шалгаж, ашиглах боломжгүй бол fallback буцаана.
// Firebase-ийн хуучин URL-ууд subscription дууссан тул ажиллахгүй.
export const photoSrc = (photoUrl, fallback = null) => {
  if (
    !photoUrl ||
    photoUrl === "no-url" ||
    photoUrl.includes("firebasestorage")
  ) {
    return fallback;
  }
  return photoUrl;
};
