import { useState } from "react";
import axios from "../utils/axios";
import firebase from "../utils/firebase";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import Button from "../components/Button";

const FirmForm = () => {
  const storage = getStorage(firebase);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    services: [],
    newService: "",
    contact: {
      phone: "",
      email: "",
    },
    location: {
      latitude: "",
      longitude: "",
    },
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [key]: value },
      }));
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleAddService = () => {
    if (formData.newService.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, formData.newService.trim()],
        newService: "",
      }));
    }
  };

  const handleRemoveService = (index) => {
    const updated = formData.services.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, services: updated }));
  };

  const handleUploadData = async (e) => {
    e.preventDefault();

    try {
      let photoUrl = "no-url";
      let photoName = "no-photo";
      // Хэрэв зураг сонгосон бол Firebase storage руу хадгалах
      if (formData.photo) {
        const storageRef = ref(storage, `FirmPhotos/${formData.photo.name}`);
        await uploadBytes(storageRef, formData.photo);
        photoUrl = await getDownloadURL(storageRef);
        photoName = formData.photo.name;
      }

      const payload = {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        services: formData.services,
        contact: {
          phone: formData.contact.phone,
          email: formData.contact.email,
        },
        location: {
          latitude: Number(formData.location.latitude),
          longitude: Number(formData.location.longitude),
        },
        photo: photoName || "no-photo",
        photoUrl: photoUrl || "no-url",
      };

      // Axios ашиглан сервер рүү илгээх
      const response = await axios.post("/firms", payload);
      console.log("Фирм амжилттай бүртгэгдлээ:", response.data);
      alert("Фирм амжилттай нэмэгдлээ!");
      // Формыг цэвэрлэх
      setFormData({
        name: "",
        address: "",
        description: "",
        services: [],
        newService: "",
        contact: {
          phone: "",
          email: "",
        },
        location: {
          latitude: "",
          longitude: "",
        },
        photo: null,
      });
    } catch (error) {
      console.error("Фирм нэмэхэд алдаа гарлаа:", error);
    }
  };

  return (
    <div className="font-code min-h-screen bg-gray-50 px-4 pt-5 pb-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Хуулийн фирм нэмэх
        </h1>
        <form onSubmit={handleUploadData} className="space-y-6">
          {/* Name, Address, Description */}
          <div>
            <label className="mb-1 block font-medium">Фирмийн нэр</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 p-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Хаяг</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 p-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Тайлбар</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 p-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Services */}
          <div>
            <label className="mb-1 block font-medium">Үйлчилгээ</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="newService"
                placeholder="Үйлчилгээ нэмэх"
                value={formData.newService}
                onChange={handleChange}
                className="flex-grow rounded-md border-gray-300 p-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="rounded-lg bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700"
              >
                Нэмэх
              </button>
            </div>
            {formData.services.length > 0 && (
              <ul className="mt-2 space-y-1">
                {formData.services.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded bg-gray-100 px-3 py-1"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveService(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Устгах
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium">Утас</label>
              <input
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">Имэйл</label>
              <input
                name="contact.email"
                value={formData.contact.email}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium">Өргөрөг</label>
              <input
                name="location.latitude"
                value={formData.location.latitude}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">Уртраг</label>
              <input
                name="location.longitude"
                value={formData.location.longitude}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="mb-1 block font-medium">Зураг</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <Button type="submit" black className="w-full">
            Хадгалах
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FirmForm;
