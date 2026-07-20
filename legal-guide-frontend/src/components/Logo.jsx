import { legalguide, legalguideDark } from "../assets";
import { useTheme } from "../context/ThemeContext";

const Logo = ({ width = 160, height = 34 }) => {
  const { theme } = useTheme();

  return (
    <img
      src={theme === "dark" ? legalguideDark : legalguide}
      width={width}
      height={height}
      alt="LegalGuide"
    />
  );
};

export default Logo;
