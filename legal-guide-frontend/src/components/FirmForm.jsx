import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import {
  inputClasses,
  labelClasses,
  fileInputClasses,
  primaryBtn,
  secondaryBtn,
  editBtn,
  deleteBtn,
} from "../utils/formStyles";

const FirmForm = () => {
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

  // Зургийг backend-ээр дамжуулан MongoDB-д хадгална
  const uploadPhoto = async (firmId) => {
    if (formData.photo instanceof File) {
      const data = new FormData();
      data.append("file", formData.photo);
      await axios.put(`/firms/${firmId}/upload-photo`, data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      };

      if (editId) {
        await axios.put(`/firms/${editId}`, payload);
        await uploadPhoto(editId);
        toast.success("Фирм шинэчлэгдлээ!");
      } else {
        const res = await axios.post("/firms", payload);
        await uploadPhoto(res.data.data._id);
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
      // Зураг фирмийн document дотор хадгалагддаг тул хамт устана
      await axios.delete(`/firms/${id}`);
      toast.success("Фирм болон зургийг амжилттай устгалаа");
      fetchFirms();
      if (editId === id) resetForm();
    } catch (err) {
      console.error("Устгахад алдаа гарлаа:", err);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-6 text-center text-xl font-bold text-slate-900 dark:text-white">
          {editId ? "Хуулийн фирм засах" : "Хуулийн фирм нэмэх"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          {["name", "address", "description"].map((field) => (
            <div key={field}>
              <label className={labelClasses}>
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
                  className={inputClasses}
                  rows={3}
                />
              ) : (
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              )}
            </div>
          ))}

          {/* Services */}
          <div>
            <label className={labelClasses}>Үйлчилгээ</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="newService"
                value={formData.newService}
                onChange={handleChange}
                placeholder="Үйлчилгээ нэмэх"
                className={`flex-grow ${inputClasses}`}
              />
              <button
                type="button"
                onClick={handleAddService}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Нэмэх
              </button>
            </div>
            {formData.services.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.services.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveService(i)}
                      className="text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Contact & Location */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {["phone", "email"].map((key) => (
              <div key={key}>
                <label className={labelClasses}>
                  {key === "phone" ? "Утас" : "Имэйл"}
                </label>
                <input
                  name={`contact.${key}`}
                  value={formData.contact[key]}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            ))}
            {["latitude", "longitude"].map((key) => (
              <div key={key}>
                <label className={labelClasses}>
                  {key === "latitude" ? "Өргөрөг" : "Уртраг"}
                </label>
                <input
                  name={`location.${key}`}
                  value={formData.location[key]}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            ))}
          </div>

          {/* Photo */}
          <div>
            <label className={labelClasses}>Зураг</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className={fileInputClasses}
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-32 w-auto rounded-xl border border-slate-200 object-cover dark:border-slate-700"
              />
            )}
          </div>

          <button type="submit" className={primaryBtn}>
            {editId ? "Шинэчлэх" : "Хадгалах"}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className={secondaryBtn}>
              Болих
            </button>
          )}
        </form>
      </div>

      {/* Firm List */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Бүртгэлтэй фирмүүд
        </h3>
        {firms.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Фирм бүртгэгдээгүй байна.
          </p>
        ) : (
          <ul className="space-y-2">
            {firms.map((firm) => (
              <li
                key={firm._id}
                className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <h4 className="truncate font-semibold text-slate-900 dark:text-white">
                    {firm.name}
                  </h4>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {firm.address}
                  </p>
                </div>
                <div className="ml-3 flex shrink-0 gap-2">
                  <button onClick={() => handleEdit(firm)} className={editBtn}>
                    Засах
                  </button>
                  <button
                    onClick={() => handleDelete(firm._id)}
                    className={deleteBtn}
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
  );
};

export default FirmForm;
