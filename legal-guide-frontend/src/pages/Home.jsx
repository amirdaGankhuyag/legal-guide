import Button from "../components/Button";

const Home = () => {
  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center bg-[url('/src/assets/background.jpg')] bg-cover bg-center bg-no-repeat text-white opacity-90">
        <div className="z-10 max-w-3xl px-6 text-center">
          <h1 className="font-code mb-4 text-4xl font-bold md:text-6xl">
            Танд хэрэгтэй хууль зүйн мэдээллийг эндээс
          </h1>
          <p className="font-code mb-6 text-lg md:text-xl">
            Танд хууль зүйн тусламж үйлчилгээ хэрэгтэй бол бидэнтэй нэгдээрэй.
          </p>
          <Button href="/login" className="mr-4" white>
            Бидэнтэй нэгдэх
          </Button>
        </div>
      </section>

      <div className="font-code flex flex-col items-center justify-center bg-gray-100 p-10 text-center md:flex-row">
        <section className="mb-9 md:mb-0 md:space-x-6">
          <h2 className="mb-3 text-2xl font-bold">Хуулийн фирмүүд</h2>
          <p className="mb-5 text-lg">
            Хууль зүйн үйлчилгээ үзүүлэгч байгууллагуудын байршилтай
            танилцаарай.
          </p>
          <Button href="/firms" black>
            Харах
          </Button>
        </section>

        <section className="mb-9 md:mb-0 md:space-x-6">
          <h2 className="mb-3 text-2xl font-bold">Хуульчид</h2>
          <p className="mb-5 text-lg">
            Мэргэшсэн хуульчдтай холбогдохыг хүсвэл энд дарна уу.
          </p>
          <Button href="/lawyers" black>
            Холбогдох
          </Button>
        </section>

        <section className="mb-9 md:mb-0 md:space-x-6">
          <h2 className="mb-3 text-2xl font-bold">Мэдээ мэдээллүүд</h2>
          <p className="mb-5 text-lg">
            Хууль зүйн мэдээ мэдээллийг цаг алдалгүй аваарай.
          </p>
          <Button href="/info" black>
            Мэдээлэл харах
          </Button>
        </section>
      </div>
    </>
  );
};

export default Home;
