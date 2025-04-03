import { useState, useEffect } from "react";
import axios from "../utils/axios";

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await axios.get("lawyers");
        setLawyers(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Хуулийн зөвлөхүүдийг авахад алдаа гарлаа", error);
      }
    };
    fetchLawyers();
  }, []);

  return (
    <div>
      <p>L</p>
    </div>
  );
};

export default Lawyers;
