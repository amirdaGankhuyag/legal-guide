import { background } from "../../assets";

export const HamburgerMenu = () => {
  return (
    <div className="pointer-events-none absolute inset-0 lg:hidden">
      <div className="absolute inset-0 opacity-[.2]">
        <img
          className="h-full w-full object-cover"
          src={background}
          width={688}
          height={953}
          alt="Background"
        />
      </div>
    </div>
  );
};
