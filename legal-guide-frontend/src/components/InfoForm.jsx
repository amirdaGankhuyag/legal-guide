import { useEffect, useState } from "react";
import axios from "../utils/axios";
import firebase from "../utils/firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
  getStorage,
} from "firebase/storage";
import Button from "../components/Button";

const InfoForm = () => {
  const storage = getStorage(firebase);
  const [form, setForm] = useState({
    title: "",
    content: "",
    summary: "",
    photo: null,
  });
  const [infos, setInfos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchInfos();
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

  const fetchInfos = async () => {
    try {
      const res = await axios.get("/infos");
      setInfos(res.data.data);
    } catch (err) {
      console.error("Мэдээлэл татаж чадсангүй", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setForm((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleUploadData = async (e) => {
    e.preventDefault();
    try {
      let photo = "no-photo";
      let photoUrl = "no-url";

      if (form.photo && typeof form.photo !== "string") {
        const storageRef = ref(storage, `InfoPhotos/${form.photo.name}`);
        await uploadBytes(storageRef, form.photo);
        photoUrl = await getDownloadURL(storageRef);
        photo = form.photo.name;
      }

      const payload = {
        title: form.title,
        content: form.content,
        summary: form.summary,
        photo,
        photoUrl,
      };

      if (editId) {
        await axios.put(`/infos/${editId}`, payload);
        alert("Мэдээлэл амжилттай шинэчлэгдлээ!");
        setEditId(null);
      } else {
        await axios.post("/infos", payload);
        alert("Мэдээлэл нэмэгдлээ!");
      }

      setForm({ title: "", content: "", summary: "", photo: null, photoUrl: null });
      fetchInfos();
    } catch (err) {
      console.error("Алдаа гарлаа", err);
    }
  };

  const handleEdit = (info) => {
    setEditId(info._id);
    setForm({
      title: info.title,
      content: info.content,
      summary: info.summary,
      photo: info.photo,
      photoUrl: info.photoUrl,
    });
  };

  const handleDelete = async (id, photoName) => {
    if (confirm("Устгах уу?")) {
      try {
        await axios.delete(`/infos/${id}`);
        if (photoName && photoName !== "no-photo") {
          const imageRef = ref(storage, `InfoPhotos/${photoName}`);
          await deleteObject(imageRef);
        }
        fetchInfos();
        alert("Мэдээлэл устгагдлаа.");
      } catch (err) {
        console.error("Устгахад алдаа гарлаа", err);
      }
    }
  };

  return (
    <div className="font-code min-h-screen bg-gray-50 px-4 pt-5 pb-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          {editId ? "Мэдээлэл засах" : "Мэдээлэл нэмэх"}
        </h1>
        <form onSubmit={handleUploadData} className="space-y-6">
          <div>
            <label className="mb-1 block font-medium">Гарчиг</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 p-2 shadow-md"
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Товч агуулга</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 p-2 shadow-md"
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">
              Дэлгэрэнгүй агуулга
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="h-32 w-full rounded-md border-gray-300 p-2 shadow-md"
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Зураг</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Зургийн preview"
                className="mt-2 h-32 w-auto rounded-md border object-cover shadow-md"
              />
            )}
          </div>
          <Button type="submit" className="w-full" black>
            {editId ? "Шинэчлэх" : "Хадгалах"}
          </Button>
        </form>
      </div>

      {/* Мэдээллийн жагсаалт */}
      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        {infos.map((info) => (
          <div key={info._id} className="rounded-md bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{info.title}</h2>
                <p className="text-gray-600">{info.summary}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(info)}
                  className="rounded bg-yellow-400 px-3 py-1 text-white"
                >
                  Засах
                </button>
                <button
                  onClick={() => handleDelete(info._id, info.photo)}
                  className="rounded bg-red-500 px-3 py-1 text-white"
                >
                  Устгах
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoForm;
