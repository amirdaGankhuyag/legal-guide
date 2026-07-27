const asyncHandler = require("../middlewares/asyncHandler");
const MyError = require("../utils/myError");
const Firm = require("../models/Firm");

// Яагаад яг flash-lite гэж сонгосон бэ:
//   1) "Бодох" (thinking) токен зарцуулдаггүй. gemini-flash-latest зэрэг том
//      загварууд энгийн асуултад ч 700+ токен бодоход зарцуулдаг бөгөөд эдгээр
//      нь maxOutputTokens дотор ТООЦОГДОНО. Улмаас хариулт дунд өгүүлбэртээ
//      тасарч, хэрэглэгчид эвдэрсэн текст харагдана.
//   2) Хариу ~1.5 секундэд ирдэг (том загвар ~4.4с). Render free tier дээр
//      сервер сэрэх хугацаа дээр нэмэгддэг тул хурд чухал.
//   3) Үнэгүй квотыг бага иддэг.
// Хэрэв дараа нь илүү ухаалаг загвар руу шилжвэл maxOutputTokens-ыг 3000
// орчим болгож, бодох токенд зай үлдээх ёстой.
const GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const MAX_MESSAGES = 20; // нэг чатанд хамгийн ихдээ хэдэн мессеж илгээхийг зөвшөөрөх
const MAX_MESSAGE_LENGTH = 2000; // нэг мессежийн дээд урт (тэмдэгтээр)
const MAX_OUTPUT_TOKENS = 800; // AI-ийн хариултын дээд урт — 3-5 өгүүлбэрт хангалттай
const TIMEOUT_MS = 30000; // 30 секунд хүлээгээд хариу ирэхгүй бол таслана

/**
 * AI-д өгөх үндсэн заавар (system instruction) бэлтгэнэ.
 *
 * Яагаад функц болгосон бэ: үйлчилгээний жагсаалт нь мэдээллийн сангаас
 * динамикаар ирдэг тул текстийг дуудалт бүрт шинээр угсрах хэрэгтэй.
 */
const buildSystemPrompt = (services) => {
  // Жагсаалт хоосон байвал (жишээ нь шинэ өгөгдлийн сан) AI-д "жагсаалт байхгүй"
  // гэдгийг ойлгуулах хэрэгтэй, эс бөгөөс хоосон мөр нь төөрөгдөл үүсгэнэ.
  const serviceList =
    services.length > 0
      ? services.map((s) => `- ${s}`).join("\n")
      : "(одоогоор бүртгэгдсэн үйлчилгээ байхгүй)";

  return `Чи бол "Legal Guide" вэб системийн AI туслах юм. Монгол Улсын
хуулийн үйлчилгээ хайж буй хэрэглэгчдэд чиг баримжаа өгөх нь чиний үүрэг.

ЧУХАЛ ХЯЗГААР:
- Чи хуульч БИШ. Албан ёсны хуулийн зөвлөгөө өгөхгүй.
- Зөвхөн ерөнхий мэдээлэл, чиг баримжаа өг.
- Хариулт бүрийн төгсгөлд мэргэжлийн хуульчид хандахыг зөвлө.
- Тодорхой хэргийн үр дүнг урьдчилан таамаглаж болохгүй.

СИСТЕМД БҮРТГЭГДСЭН ҮЙЛЧИЛГЭЭНИЙ ТӨРЛҮҮД:
${serviceList}

ХАРИУЛАХ ДҮРЭМ:
- Хэрэглэгчийн асуултад тохирох үйлчилгээний төрлийг ДЭЭРХ ЖАГСААЛТААС сонгож
  санал болго. Жагсаалтад байхгүй үйлчилгээг зохиож болохгүй.
- Хариултаа 3-5 өгүүлбэрт багтаа. Урт эссэ бичихгүй.
- Хэрэглэгч ямар хэлээр бичсэн, тэр хэлээрээ хариул (монгол эсвэл англи).
- Хуулийн бус асуулт (жор, код бичих, ерөнхий чалчаа) асуувал эелдэгээр
  татгалзаж, чи зөвхөн хуулийн үйлчилгээний талаар туслах боломжтойг хэл.`;
};

/**
 * Frontend-ээс ирсэн мессежүүдийг шалгаад Gemini API-ийн форматад хөрвүүлнэ.
 *
 * Gemini нь { role, parts: [{ text }] } гэсэн бүтэц шаарддаг ба role нь зөвхөн
 * "user" эсвэл "model" байна — "assistant" гэж ойлгодоггүй. Frontend талд
 * "assistant" гэж бичих нь түгээмэл тул хоёуланг нь хүлээж авч хөрвүүлнэ.
 */
const toGeminiContents = (messages) => {
  // 1) Массив мөн эсэх, хоосон биш эсэх
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new MyError("Мессеж илгээгээгүй байна", 400);
  }

  // 2) Урт хязгаарлах.
  // Яагаад: API нь stateless тул чатны бүх түүхийг frontend илгээдэг. Хэрэв
  // хязгаар тавихгүй бол хэн нэгэн 5000 мөртэй массив илгээж, өдрийн үнэгүй
  // квотыг ганц дуудалтаар шавхах боломжтой.
  if (messages.length > MAX_MESSAGES) {
    throw new MyError(
      `Нэг ярианд хамгийн ихдээ ${MAX_MESSAGES} мессеж илгээх боломжтой. Шинэ яриа эхлүүлнэ үү.`,
      400,
    );
  }

  const contents = messages.map((msg, index) => {
    // 3) Элемент бүр объект мөн эсэх.
    // typeof null === "object" тул null-ийг тусад нь шалгах шаардлагатай.
    if (!msg || typeof msg !== "object") {
      throw new MyError(`${index + 1}-р мессежийн бүтэц буруу байна`, 400);
    }

    // 4) role-г нормчлох
    const role = msg.role === "assistant" ? "model" : msg.role;
    if (role !== "user" && role !== "model") {
      throw new MyError(`${index + 1}-р мессежийн role буруу байна`, 400);
    }

    // 5) Текстийг шалгах
    const text = typeof msg.text === "string" ? msg.text.trim() : "";
    if (!text) {
      throw new MyError(`${index + 1}-р мессеж хоосон байна`, 400);
    }
    if (text.length > MAX_MESSAGE_LENGTH) {
      throw new MyError(
        `Мессеж хэт урт байна (дээд тал нь ${MAX_MESSAGE_LENGTH} тэмдэгт)`,
        400,
      );
    }

    return { role, parts: [{ text }] };
  });

  // 6) Хамгийн сүүлийн мессеж хэрэглэгчийнх байх ёстой.
  // Эс бөгөөс AI-д хариулах зүйл байхгүй — өөрийнхөө өмнөх хариултыг
  // дахин "үргэлжлүүлэх" гэж оролдоод хачин үр дүн өгнө.
  if (contents[contents.length - 1].role !== "user") {
    throw new MyError("Сүүлийн мессеж хэрэглэгчийнх байх ёстой", 400);
  }

  return contents;
};

/**
 * POST /api/v1/chat
 * AI хуулийн туслахтай харилцах
 */
exports.chatWithAI = asyncHandler(async (req, res, next) => {
  // ── 1. Орж ирсэн өгөгдлийг шалгаж хөрвүүлэх ──
  const contents = toGeminiContents(req.body.messages);

  // ── 2. Системд бүртгэлтэй үйлчилгээний жагсаалтыг татах ──
  // distinct() нь бүх фирмийн services[] массивуудаас давхардалгүй утгуудыг
  // нэг хавтгай массив болгож буцаана. Ингэснээр AI зөвхөн бодитоор байгаа
  // ангиллаас санал болгож, хэрэглэгчийг хоосон хайлт руу чиглүүлэхгүй.
  const services = await Firm.distinct("services");

  // ── 3. Gemini API руу хүсэлт илгээх ──
  let response;
  try {
    response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        // system_instruction нь contents-оос ТУСДАА талбар. Ингэснээр
        // хэрэглэгч мессежээрээ дамжуулан зааврыг дарж бичих боломжгүй болно.
        system_instruction: {
          parts: [{ text: buildSystemPrompt(services) }],
        },
        contents,
        generationConfig: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      }),
      // Хугацаа хэтэрвэл автоматаар таслана. Үүнгүй бол Google талд асуудал
      // гарвал request хэдэн минутаар өлгөгдөж, Render дээрх сервер боогдоно.
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    // AbortSignal.timeout нь TimeoutError нэртэй алдаа шиднэ
    if (err.name === "TimeoutError") {
      throw new MyError(
        "AI туслах удаан хариулж байна. Дахин оролдоно уу.",
        504,
      );
    }
    // Сүлжээний бусад алдаа (DNS, холболт тасрах гэх мэт)
    console.error("Gemini холболтын алдаа:", err.message);
    throw new MyError("AI туслахтай холбогдож чадсангүй.", 503);
  }

  // ── 4. HTTP статусыг шалгах ──
  // ЧУХАЛ: fetch нь 400/500 статус ирэхэд алдаа ШИДДЭГГҮЙ. Зөвхөн сүлжээ
  // тасрахад шиднэ. Тиймээс response.ok-г гараар шалгах ёстой.
  if (!response.ok) {
    const errorBody = await response.text();
    // Бүтэн алдааг зөвхөн server log руу бичнэ — API түлхээр эсвэл дотоод
    // мэдээлэл агуулсан байж болзошгүй тул хэрэглэгчид харуулахгүй.
    console.error("Gemini API алдаа:", response.status, errorBody);
    throw new MyError(
      "AI туслах түр ажиллахгүй байна. Дараа оролдоно уу.",
      503,
    );
  }

  const data = await response.json();

  // ── 5. Хариултаас текстийг гаргаж авах ──
  // Optional chaining (?.) ашигласан шалтгаан: аюулгүй байдлын шүүлтүүр
  // ажиллавал candidates хоосон ирж, шууд индекслэвэл програм унана.
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    // promptFeedback.blockReason нь агуулга хориглогдсон шалтгааныг заана
    const blockReason = data.promptFeedback?.blockReason;
    console.error("Gemini хоосон хариу:", JSON.stringify(data));
    throw new MyError(
      blockReason
        ? "Энэ асуултад хариулах боломжгүй байна. Өөрөөр асууна уу."
        : "AI туслахаас хариу ирсэнгүй. Дахин оролдоно уу.",
      502,
    );
  }

  // finishReason нь MAX_TOKENS байвал хариулт дундаа тасарсан гэсэн үг.
  // Алдаа биш тул хаяхгүй, гэхдээ frontend-д мэдэгдэж болно.
  const truncated = data.candidates[0].finishReason === "MAX_TOKENS";

  res.status(200).json({
    success: true,
    data: {
      role: "model",
      text: reply.trim(),
      truncated,
    },
  });
});
