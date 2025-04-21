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

const LawyerForm = () => {
  const storage = getStorage(firebase);
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
    });
    setEditId(null);
    setPreviewUrl(null);
  };

  const handleUploadData = async (e) => {
    e.preventDefault();
    try {
      let photo = "no-photo",
        photoUrl = "no-url";

      if (form.photo) {
        const storageRef = ref(storage, `LawyerPhotos/${form.photo.name}`);
        await uploadBytes(storageRef, form.photo);
        photoUrl = await getDownloadURL(storageRef);
        photo = form.photo.name;
      }

      const payload = {
        ...form,
        photo,
        photoUrl,
        services: form.services,
      };

      if (editId) {
        await axios.put(`/lawyers/${editId}`, payload);
        alert("Хуульчийн мэдээлэл шинэчлэгдлээ.");
      } else {
        await axios.post("/lawyers", payload);
        alert("Хуульч амжилттай нэмэгдлээ.");
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
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Устгахдаа итгэлтэй байна уу?")) {
      try {
        await axios.delete(`/lawyers/${id}`);
        alert("Хуульч устгагдлаа.");
        fetchLawyers();
        if (editId === id) resetForm();
      } catch (err) {
        console.error("Устгахад алдаа гарлаа:", err);
      }
    }
  };

  return (
    <div className="font-code min-h-screen bg-gray-50 px-4 pt-5 pb-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          {editId ? "Хуульчийн мэдээлэл засах" : "Хуульч мэдээлэл нэмэх"}
        </h1>
        <form onSubmit={handleUploadData} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium">Овог</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-sm"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">Нэр</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium">Албан тушаал</label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-sm"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">Ажлын хаяг</label>
              <input
                name="workAddress"
                value={form.workAddress}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium">Утас</label>
              <input
                name="contact.phone"
                value={form.contact.phone}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-sm"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">Имэйл</label>
              <input
                name="contact.email"
                value={form.contact.email}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium">Facebook хаяг</label>
              <input
                name="contact.facebookAcc"
                value={form.contact.facebookAcc}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-sm"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">Instagram хаяг</label>
              <input
                name="contact.instagramAcc"
                value={form.contact.instagramAcc}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 p-2 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-medium">Үйлчилгээ нэмэх</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Үйлчилгээ нэмэх"
                name="newService"
                value={form.newService}
                onChange={handleChange}
                className="flex-grow rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="rounded-lg bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700"
              >
                Нэмэх
              </button>
            </div>
            {form.services.length > 0 && (
              <ul className="mt-2 space-y-1">
                {form.services.map((s, i) => (
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

          <div>
            <label className="mb-1 block font-medium">Зураг</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-32 w-auto rounded-md border object-cover shadow-md"
              />
            )}

          <div className="text-center">
            <Button type="submit" black className="w-full">
              {editId ? "Шинэчлэх" : "Хадгалах"}
            </Button>
            {editId && (
              <Button
                type="button"
                black
                onClick={resetForm}
                className="mt-2 w-full"
              >
                Болих
              </Button>
            )}
          </div>
        </form>
        {/* Lawyer List */}
        <div className="mt-5 pt-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Хуульчдын жагсаалт
          </h2>
          <ul className="space-y-2">
            {lawyers.map((lawyer) => (
              <li
                key={lawyer._id}
                className="flex items-center justify-between rounded bg-gray-100 px-4 py-2"
              >
                <div>
                  {lawyer.lastName} {lawyer.firstName} - {lawyer.position}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(lawyer)}
                    className="rounded bg-yellow-400 px-3 py-1 text-white hover:bg-yellow-500"
                  >
                    Засах
                  </button>
                  <button
                    onClick={() => handleDelete(lawyer._id)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Устгах
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LawyerForm;
