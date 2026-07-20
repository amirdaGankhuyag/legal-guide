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

const LawyerForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    position: "",
    workAddress: "",
    contact: { phone: "", email: "", facebookAcc: "", instagramAcc: "" },
    services: [],
    newService: "",
    photo: null,
    photoUrl: "no-url",
    introduction: "",
    experience: "",
  });
  const [editId, setEditId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    fetchLawyers();
  }, []);

  useEffect(() => {
    if (form.photo instanceof File) {
      setPreviewUrl(URL.createObjectURL(form.photo));
    } else if (form.photoUrl && form.photoUrl !== "no-url") {
      setPreviewUrl(form.photoUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [form.photo, form.photoUrl]);

  const fetchLawyers = async () => {
    try {
      const res = await axios.get("/lawyers");
      setLawyers(res.data.data);
    } catch (err) {
      console.error("Хуульчдын мэдээлэл татаж чадсангүй", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        contact: { ...prev.contact, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e) => {
    setForm((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleAddService = () => {
    if (form.newService.trim()) {
      setForm((prev) => ({
        ...prev,
        services: [...prev.services, form.newService.trim()],
        newService: "",
      }));
    }
  };

  const handleRemoveService = (index) => {
    const updated = form.services.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, services: updated }));
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      position: "",
      workAddress: "",
      contact: { phone: "", email: "", facebookAcc: "", instagramAcc: "" },
      services: [],
      newService: "",
      photo: null,
      photoUrl: "no-url",
      introduction: "",
      experience: "",
    });
    setEditId(null);
    setPreviewUrl(null);
  };

  // Зургийг backend-ээр дамжуулан MongoDB-д хадгална
  const uploadPhoto = async (lawyerId) => {
    if (form.photo instanceof File) {
      const data = new FormData();
      data.append("file", form.photo);
      await axios.put(`/lawyers/${lawyerId}/upload-photo`, data);
    }
  };

  const handleUploadData = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        position: form.position,
        workAddress: form.workAddress,
        contact: form.contact,
        introduction: form.introduction,
        experience: form.experience,
        services: form.services,
      };

      if (editId) {
        await axios.put(`/lawyers/${editId}`, payload);
        await uploadPhoto(editId);
        toast.success("Хуульчийн мэдээлэл шинэчлэгдлээ.");
      } else {
        const res = await axios.post("/lawyers", payload);
        await uploadPhoto(res.data.data._id);
        toast.success("Хуульч амжилттай нэмэгдлээ.");
      }

      resetForm();
      fetchLawyers();
    } catch (err) {
      console.error("Хуульч нэмэхэд алдаа гарлаа:", err);
    }
  };

  const handleEdit = (lawyer) => {
    setEditId(lawyer._id);
    setForm({
      firstName: lawyer.firstName || "",
      lastName: lawyer.lastName || "",
      position: lawyer.position || "",
      workAddress: lawyer.workAddress || "",
      contact: lawyer.contact || {
        phone: "",
        email: "",
        facebookAcc: "",
        instagramAcc: "",
      },
      services: lawyer.services || [],
      newService: "",
      photo: null,
      photoUrl: lawyer.photoUrl || "no-url",
      introduction: lawyer.introduction || "",
      experience: lawyer.experience || "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Устгахдаа итгэлтэй байна уу?")) {
      try {
        // Зураг хуульчийн document дотор хадгалагддаг тул хамт устана
        await axios.delete(`/lawyers/${id}`);
        toast.success("Хуульч устгагдлаа.");
        fetchLawyers();
        if (editId === id) resetForm();
      } catch (err) {
        console.error("Устгахад алдаа гарлаа:", err);
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-6 text-center text-xl font-bold text-slate-900 dark:text-white">
          {editId ? "Хуульчийн мэдээлэл засах" : "Хуульч мэдээлэл нэмэх"}
        </h2>
        <form onSubmit={handleUploadData} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Овог</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Нэр</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Албан тушаал</label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Ажлын хаяг</label>
              <input
                name="workAddress"
                value={form.workAddress}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Утас</label>
              <input
                name="contact.phone"
                value={form.contact.phone}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Имэйл</label>
              <input
                name="contact.email"
                value={form.contact.email}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Танилцуулга</label>
              <input
                name="introduction"
                value={form.introduction}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Ажлын туршлага</label>
              <input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Facebook хаяг</label>
              <input
                name="contact.facebookAcc"
                value={form.contact.facebookAcc}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Instagram хаяг</label>
              <input
                name="contact.instagramAcc"
                value={form.contact.instagramAcc}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Үйлчилгээ нэмэх</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Үйлчилгээ нэмэх"
                name="newService"
                value={form.newService}
                onChange={handleChange}
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
            {form.services.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.services.map((s, i) => (
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

      {/* Lawyer List */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Хуульчдын жагсаалт
        </h3>
        <ul className="space-y-2">
          {lawyers.map((lawyer) => (
            <li
              key={lawyer._id}
              className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="min-w-0 truncate text-slate-900 dark:text-white">
                {lawyer.lastName} {lawyer.firstName} · {lawyer.position}
              </div>
              <div className="ml-3 flex shrink-0 gap-2">
                <button onClick={() => handleEdit(lawyer)} className={editBtn}>
                  Засах
                </button>
                <button
                  onClick={() => handleDelete(lawyer._id)}
                  className={deleteBtn}
                >
                  Устгах
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LawyerForm;
