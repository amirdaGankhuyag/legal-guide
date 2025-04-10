import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    
    if (token && role) {
      login(token, role);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [searchParams]);
  return null;
};
export default Success;
