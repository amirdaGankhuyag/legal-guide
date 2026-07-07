# Бакалаврын судалгааны ажил (THES400)

Хуулийн үйлчилгээ үзүүлэгч байгууллагуудыг газрын зургаас олох веб апп - Map based legal advice agency finder </br>
"LegalGuide" систем </br> </br>

Удирдагч багш: Р. Жавхлан </br>
Гүйцэтгэсэн: Г. Амирда </br> </br>
МОНГОЛ УЛСЫН ИХ СУРГУУЛЬ </br>
МЭДЭЭЛЛИЙН ТЕХНОЛОГИ, ЭЛЕКТРОНИКИЙН СУРГУУЛЬ </br>
МЭДЭЭЛЭЛ, КОМПЬЮТЕРЫН УХААНЫ ТЭНХИМ </br>
Программ хангамж (D061302) </br> </br>
2025 он

---

## Deployment

| Орчин | Хаяг | Үүрэг |
|---|---|---|
| **Production (үндсэн)** | https://legal-guide-three.vercel.app | Vercel — албан ёсны ажиллаж буй хувилбар |
| Нөөц / туршилт | https://amirdagankhuyag.github.io/legal-guide/ | GitHub Pages — `npm run deploy`-оор гараар шинэчилнэ |
| Backend API | https://legal-guide-n8eg.onrender.com/api/v1/ | Render (free tier) — Express + MongoDB Atlas |

**Тэмдэглэл:**

- Зургууд MongoDB-д хадгалагдана (`photoData` Buffer талбар), `GET /api/v1/{firms,lawyers,infos}/:id/photo` endpoint-оор үзүүлнэ.
- `main` branch руу push хийхэд Vercel (frontend) болон Render (backend) автоматаар шинэчлэгдэнэ. GitHub Pages-ийг `legal-guide-frontend` дотор `npm run deploy` командаар гараар шинэчилнэ.
- Google OAuth-ийн буцах хаяг backend-ийн `FRONTEND_URL` env var-аар тодорхойлогддог тул зөвхөн Vercel дээр бүрэн ажиллана. GH Pages дээрх Google login хэрэглэгчийг Vercel руу буцаана (имэйл/нууц үгийн login хэвийн).
- Render free tier 15 минут идэвхгүй байвал унтардаг — эхний хүсэлт ~50 секунд удаан.
