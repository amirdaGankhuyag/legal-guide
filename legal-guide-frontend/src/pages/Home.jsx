import Button from "../components/Button";

const Home = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-[url('/src/assets/background.jpg')] bg-cover bg-center bg-no-repeat text-white opacity-90">
      <div className="z-10 max-w-3xl px-6 text-center">
        <h1 className="font-code mb-4 text-4xl font-bold md:text-6xl">
          Орчин цагийн хууль зүйн мэдээллийг эндээс
        </h1>
        <p className="font-code mb-6 text-lg md:text-xl">
          Танд хууль зүйн тусламж үйлчилгээ хэрэгтэй бол бидэнтэй нэгдээрэй.
        </p>
        <Button href="/login" className="mr-4" white>
          Бидэнтэй нэгдэх
        </Button>
      </div>
    </section>
  );
};

export default Home;
