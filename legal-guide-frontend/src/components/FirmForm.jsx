import { useState, useEffect } from "react";
import axios from "../utils/axios";
import firebase from "../utils/firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  getStorage,
  deleteObject,
} from "firebase/storage";
import Button from "../components/Button";
import { toast } from "react-toastify";

const FirmForm = () => {
  const storage = getStorage(firebase);
  const initialFormData = {
    name: "",
    address: "",
    description: "",
    services: [],
    newService: "",
    contact: { phone: "", email: "" },
    location: { latitude: "", longitude: "" },
    photo: null,
    photoUrl: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [firms, setFirms] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchFirms();
  }, []);

  useEffect(() => {
    if (formData.photo instanceof File) {
      setPreviewUrl(URL.createObjectURL(formData.photo));
    } else if (formData.photoUrl) {
      setPreviewUrl(formData.photoUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [formData.photo, formData.photoUrl]);

  const fetchFirms = async () => {
    try {
      const res = await axios.get("/firms/all");
      setFirms(res.data.data);
    } catch (err) {
      console.error("Фирмүүдийг татаж чадсангүй", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.") || name.startsWith("location.")) {
      const [section, key] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e) =>
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));

  const handleAddService = () => {
    const newService = formData.newService.trim();
    if (newService) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, newService],
        newService: "",
      }));
    }
  };

  const handleRemoveService = (index) => {
    const updated = formData.services.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, services: updated }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setPreviewUrl(null);
    setEditId(null);
  };

  const uploadPhoto = async () => {
    if (formData.photo instanceof File) {
      const storageRef = ref(storage, `FirmPhotos/${formData.photo.name}`);
      await uploadBytes(storageRef, formData.photo);
      const photoUrl = await getDownloadURL(storageRef);
      return { photoUrl, photoName: formData.photo.name };
    }
    return { photoUrl: formData.photoUrl || "no-url", photoName: "no-photo" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { photoUrl, photoName } = await uploadPhoto();

      const payload = {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        services: formData.services,
        contact: formData.contact,
        location: {
          latitude: Number(formData.location.latitude),
          longitude: Number(formData.location.longitude),
        },
        photo: photoName,
        photoUrl,
      };

      if (editId) {
        await axios.put(`/firms/${editId}`, payload);
        toast.success("Фирм шинэчлэгдлээ!");
      } else {
        await axios.post("/firms", payload);
        toast.success("Фирм нэмэгдлээ!");
      }

      resetForm();
      fetchFirms();
    } catch (error) {
      console.error("Хадгалахад алдаа гарлаа:", error);
    }
  };

  const handleEdit = (firm) => {
    setFormData({
      name: firm.name,
      address: firm.address,
      description: firm.description,
      services: firm.services,
      newService: "",
      contact: firm.contact,
      location: {
        latitude: firm.location.latitude.toString(),
        longitude: firm.location.longitude.toString(),
      },
      photo: null,
      photoUrl: firm.photoUrl,
    });
    setEditId(firm._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Фирмийг устгах уу?")) return;

    try {
      // Эхлээд фирмийн мэдээллийг авч зургийн нэрийг олно
      const firm = firms.find((f) => f._id === id);

      if (firm && firm.photo && firm.photo !== "no-photo") {
        const imageRef = ref(storage, `FirmPhotos/${firm.photo}`);
        await deleteObject(imageRef);
        console.log("Firebase дээрх зураг устгагдлаа");
      }

      // Дараа нь MongoDB-с устгана
      await axios.delete(`/firms/${id}`);
      toast.success("Фирм болон зургийг амжилттай устгалаа");
      fetchFirms();
      if (editId === id) resetForm();
    } catch (err) {
      console.error("Устгахад алдаа гарлаа:", err);
    }
  };

  return (
    <div className="font-code min-h-screen bg-gray-50 px-4 pt-5 pb-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          {editId ? "Хуулийн фирм засах" : "Хуулийн фирм нэмэх"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          {["name", "address", "description"].map((field) => (
            <div key={field}>
              <label className="mb-1 block font-medium">
                {field === "name"
                  ? "Фирмийн нэр"
                  : field === "address"
                    ? "Хаяг"
                    : "Тайлбар"}
              </label>
              {field === "description" ? (
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 p-2 shadow-md"
                />
              ) : (
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 p-2 shadow-md"
                />
              )}
            </div>
          ))}

          {/* Services */}
          <div>
            <label className="mb-1 block font-medium">Үйлчилгээ</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="newService"
                value={formData.newService}
                onChange={handleChange}
                placeholder="Үйлчилгээ нэмэх"
                className="flex-grow rounded-md border-gray-300 p-2 shadow-md"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="rounded bg-blue-600 px-3 py-1 text-white"
              >
                Нэмэх
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {formData.services.map((s, i) => (
                <li
                  key={i}
                  className="flex justify-between rounded bg-gray-100 px-3 py-1"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveService(i)}
                    className="text-red-500"
                  >
                    Устгах
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {["phone", "email"].map((key) => (
              <div key={key}>
                <label className="mb-1 block font-medium">
                  {key === "phone" ? "Утас" : "Имэйл"}
                </label>
                <input
                  name={`contact.${key}`}
                  value={formData.contact[key]}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 p-2 shadow-md"
                />
              </div>
            ))}
            {["latitude", "longitude"].map((key) => (
              <div key={key}>
                <label className="mb-1 block font-medium">
                  {key === "latitude" ? "Өргөрөг" : "Уртраг"}
                </label>
                <input
                  name={`location.${key}`}
                  value={formData.location[key]}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 p-2 shadow-md"
                />
              </div>
            ))}
          </div>

          {/* Photo */}
          <div>
            <label className="mb-1 block font-medium">Зураг</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-32 w-auto rounded-md border object-cover shadow-md"
              />
            )}
          </div>

          <Button type="submit" black className="w-full">
            {editId ? "Шинэчлэх" : "Хадгалах"}
          </Button>
          {editId && (
            <Button type="button" black onClick={resetForm} className="w-full">
              Болих
            </Button>
          )}
        </form>

        {/* Firm List */}
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Бүртгэлтэй фирмүүд</h2>
          {firms.length === 0 ? (
            <p>Фирм бүртгэгдээгүй байна.</p>
          ) : (
            <ul className="space-y-2">
              {firms.map((firm) => (
                <li
                  key={firm._id}
                  className="flex justify-between rounded-md bg-gray-100 p-3"
                >
                  <div>
                    <h3 className="font-semibold">{firm.name}</h3>
                    <p className="text-sm text-gray-600">{firm.address}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(firm)}
                      className="rounded bg-yellow-400 px-3 py-1 text-white hover:bg-yellow-500"
                    >
                      Засах
                    </button>
                    <button
                      onClick={() => handleDelete(firm._id)}
                      className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    >
                      Устгах
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirmForm;
