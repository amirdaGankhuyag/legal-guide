import { Link } from "react-router-dom";
import ButtonSvg from "../assets/svg/ButtonSvg";

const Button = ({ className, href, onClick, children, px, white, black }) => {
  const classes = `button relative inline-flex items-center justify-center h-11 transition-colors hover:text-1 ${
    px || "px-7"
  } ${
    black ? "text-black" : white ? "text-neutral-800" : "text-neutral-100"
  } ${className || ""}`;

  const spanClasses = `relative z-10`;

  const renderButton = () => (
    <button className={classes} onClick={onClick}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </button>
  );

  const renderLink = () => (
    <Link to={href} className={classes}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </Link>
  );

  return href ? renderLink() : renderButton();
};

export default Button;
