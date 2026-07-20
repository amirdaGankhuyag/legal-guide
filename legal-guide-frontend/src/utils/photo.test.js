import { describe, it, expect } from "vitest";
import { photoSrc } from "./photo";

// photoSrc-ийн үндсэн дүрмүүд:
// 1) Хоосон/"no-url"/Firebase URL → fallback буцаана
// 2) /api/v1/ агуулсан URL → domain хэсгийг одоогийн API хаягаар солино
// 3) Бусад URL → өөрчлөлтгүй буцаана

describe("photoSrc", () => {
  it("photoUrl байхгүй үед fallback буцаана", () => {
    expect(photoSrc(null, "/default.jpg")).toBe("/default.jpg");
    expect(photoSrc(undefined, "/default.jpg")).toBe("/default.jpg");
    expect(photoSrc("", "/default.jpg")).toBe("/default.jpg");
  });

  it('"no-url" утгад fallback буцаана', () => {
    expect(photoSrc("no-url", "/default.jpg")).toBe("/default.jpg");
  });

  it("fallback өгөөгүй бол null буцаана", () => {
    expect(photoSrc("no-url")).toBeNull();
  });

  it("Firebase-ийн хуучин URL-д fallback буцаана", () => {
    const firebaseUrl =
      "https://firebasestorage.googleapis.com/v0/b/legal-guide/o/photo.jpg";
    expect(photoSrc(firebaseUrl, "/default.jpg")).toBe("/default.jpg");
  });

  it("хуучин domain-тэй /api/v1/ URL-ыг одоогийн API хаягаар дахин бичнэ", () => {
    // Тест орчинд VITE_API_URL байхгүй тул API_BASE = http://localhost:5000/api/v1/
    const oldUrl = "http://old-host.example.com/api/v1/firms/123/photo";
    expect(photoSrc(oldUrl)).toBe(
      "http://localhost:5000/api/v1/firms/123/photo",
    );
  });

  it("localhost-той хадгалагдсан URL мөн дахин бичигдэнэ", () => {
    const localUrl = "http://localhost:5000/api/v1/lawyers/abc/photo";
    expect(photoSrc(localUrl)).toBe(
      "http://localhost:5000/api/v1/lawyers/abc/photo",
    );
  });

  it("/api/v1/ агуулаагүй энгийн URL-ыг өөрчлөхгүй", () => {
    const externalUrl = "https://example.com/images/photo.jpg";
    expect(photoSrc(externalUrl)).toBe(externalUrl);
  });
});
