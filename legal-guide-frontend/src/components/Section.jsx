import SectionSvg from "../assets/svg/SectionSvg";

const Section = ({
  className,
  id, //section id
  crosses, // have them or not
  crossesOffset, // offset for crosses
  customPaddings,
  children,
}) => {
  return (
    <div
      id={id}
      className={`relative ${
        customPaddings ||
        `py-10 lg:py-16 xl:py-20 ${crosses ? "lg:py-32 xl:py-40" : ""}`
      } ${className || ""}`}
    >
      {children}
      {crosses && (
        <>
          <div
            className={`bg-stroke-1 absolute top-0 right-7.5 left-7.5 hidden h-0.25 ${
              crossesOffset && crossesOffset
            } pointer-events-none right-10 lg:block xl:left-10`}
          />
          <SectionSvg crossesOffset={crossesOffset} />
        </>
      )}
    </div>
  );
};

export default Section;
