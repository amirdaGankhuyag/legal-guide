import { useState } from "react";
import axios from "../utils/axios";
import firebase from "../utils/firebase";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import Button from "../components/Button";

const InfoForm = () => {
  const storage = getStorage(firebase);
  const [form, setForm] = useState({
    title: "",
    content: "",
    summary: "",
    photo: null,
  });

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

      if (form.photo) {
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

      const response = await axios.post("/infos", payload);
      console.log("Мэдээлэл амжилттай бүртгэгдлээ:", response.data);
      alert("Мэдээлэл нэмэгдлээ!");

      // Reset form
      setForm({ title: "", content: "", summary: "", photo: null });
    } catch (err) {
      console.error("Алдаа гарлаа", err);
      alert("Мэдээлэл илгээхэд алдаа гарлаа.");
    }
  };

  return (
    <div className="font-code min-h-screen bg-gray-50 px-4 pt-5 pb-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Мэдээлэл нэмэх
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
          </div>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 p-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
          <div>
            <label className="mb-1 block font-medium">
              Дэлгэрэнгүй агуулга
            </label>
          </div>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="h-32 w-full rounded-md border-gray-300 p-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
          <div>
            <label className="mb-1 block font-medium">Зураг</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <Button type="submit" className="w-full" black>
            Хадгалах
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InfoForm;
