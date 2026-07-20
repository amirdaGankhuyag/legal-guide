import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiMapPin, FiUsers, FiFileText, FiArrowRight } from "react-icons/fi";

// Хуучин Home.jsx нь бараан grayscale гэрэл зурагтай hero + энгийн 3 багана
// байсныг орчин үеийн SaaS дизайны стандарт дагуу (Indigo/Cyan өнгөний
// схем, зөөлөн сүүдэр, дугуй булан, өргөн сөрөг орон зай) шинэчилсэн.

const features = [
  {
    icon: FiMapPin,
    accent:
      "text-sky-600 bg-sky-50 group-hover:bg-sky-600 dark:text-sky-400 dark:bg-sky-950/40",
    title: "Хуулийн фирмүүд",
    description:
      "Хууль зүйн үйлчилгээ үзүүлэгч байгууллагуудын байршилтай газрын зураг дээрээс танилцаарай.",
    href: "/firms",
    cta: "Харах",
  },
  {
    icon: FiUsers,
    accent:
      "text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 dark:text-indigo-400 dark:bg-indigo-950/40",
    title: "Хуульчид",
    description:
      "Мэргэшсэн хуульчдын мэдээлэлтэй танилцаж, шууд холбогдохыг хүсвэл энд дарна уу.",
    href: "/lawyers",
    cta: "Холбогдох",
  },
  {
    icon: FiFileText,
    accent:
      "text-violet-600 bg-violet-50 group-hover:bg-violet-600 dark:text-violet-400 dark:bg-violet-950/40",
    title: "Мэдээ мэдээллүүд",
    description:
      "Хууль зүйн чиглэлээр бэлтгэсэн нийтлэл, мэдээ мэдээллийг цаг алдалгүй аваарай.",
    href: "/infos",
    cta: "Мэдээлэл харах",
  },
];

const Home = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const handleClick = (href) => {
    if (isAuth) {
      navigate(href);
    } else {
      toast.error("Та эхлээд нэвтэрнэ үү!");
    }
  };

  return (
    <div className="font-sans">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Indigo/Cyan blur blob-ууд — орчин үеийн SaaS hero-нд түгээмэл хэв маяг */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-0 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl"
        />

        <div className="relative container mx-auto flex flex-col items-center px-6 py-24 text-center md:py-32">
          <span className="mb-6 inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
            Монголын хуулийн үйлчилгээний платформ
          </span>

          <h1 className="max-w-3xl text-4xl leading-tight font-bold tracking-tight text-slate-900 md:text-6xl md:leading-tight dark:text-white">
            Танд хэрэгтэй хууль зүйн тусламжийг{" "}
            <span className="text-indigo-600 dark:text-indigo-400">эндээс</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            Бид танд ойр байрлах хуулийн үйлчилгээ үзүүлэгчдийг газрын зураг
            дээр харуулж, сонголтоо хийхэд тань тусална.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            {!isAuth ? (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-colors hover:bg-indigo-700"
              >
                Эхлэх
                <FiArrowRight />
              </Link>
            ) : (
              <Link
                to="/firms"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-colors hover:bg-indigo-700"
              >
                Хайлт эхлүүлэх
                <FiArrowRight />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─── Боломжуудын карт ─── */}
      <section className="bg-white py-24 dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
              Хэрхэн ажилладаг вэ
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
              Танд тохирсон хуулийн туслалцааг олоорой
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/50"
                >
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-colors group-hover:text-white ${feature.accent}`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                  <button
                    onClick={() => handleClick(feature.href)}
                    className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 transition-all hover:gap-2.5 dark:text-indigo-400"
                  >
                    {feature.cta}
                    <FiArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
