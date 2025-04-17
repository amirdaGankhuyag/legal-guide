import { useState } from "react";
import FirmForm from "../components/FirmForm";
import LawyerForm from "../components/LawyerForm";
import InfoForm from "../components/InfoForm";
import Button from "../components/Button";

const AdminPanel = () => {
  const [section, setSection] = useState("firm");

  return (
    <div className="bg-gray-50 px-4 py-2">
      <h1 className="font-code ml-2 flex justify-center text-2xl font-bold">
        Админ хуудас
      </h1>
      <div className="flex justify-center gap-4 py-4">
        <Button onClick={() => setSection("firm")} black>
          Фирм
        </Button>
        <Button onClick={() => setSection("lawyer")} black>
          Хуульч
        </Button>
        <Button onClick={() => setSection("info")} black>
          Мэдээлэл
        </Button>
      </div>

      {section === "firm" && <FirmForm />}
      {section === "lawyer" && <LawyerForm />}
      {section === "info" && <InfoForm />}
    </div>
  );
};

export default AdminPanel;
