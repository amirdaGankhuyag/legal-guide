import { useEffect, useState } from "react";
import axios from "../utils/axios";
import Button from "../components/Button";
import { toast } from "react-toastify";
import MDEditor from "@uiw/react-md-editor";

const InfoForm = () => {
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

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      summary: "",
      photo: null,
      photoUrl: null,
    });
    setEditId(null);
    setPreviewUrl(null);
  };

  // Зургийг backend-ээр дамжуулан MongoDB-д хадгална
  const uploadPhoto = async (infoId) => {
    if (form.photo instanceof File) {
      const data = new FormData();
      data.append("file", form.photo);
      await axios.put(`/infos/${infoId}/upload-photo`, data);
    }
  };

  const handleUploadData = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        content: form.content,
        summary: form.summary,
      };

      if (editId) {
        await axios.put(`/infos/${editId}`, payload);
        await uploadPhoto(editId);
        toast.success("Мэдээлэл амжилттай шинэчлэгдлээ!");
        setEditId(null);
      } else {
        const res = await axios.post("/infos", payload);
        await uploadPhoto(res.data.data._id);
        toast.success("Мэдээлэл нэмэгдлээ!");
      }
      resetForm();
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

  const handleDelete = async (id) => {
    if (confirm("Устгах уу?")) {
      try {
        // Зураг мэдээллийн document дотор хадгалагддаг тул хамт устана
        await axios.delete(`/infos/${id}`);
        fetchInfos();
        toast.success("Мэдээлэл устгагдлаа.");
        if (editId === id) resetForm();
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
            {/* <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="h-32 w-full rounded-md border-gray-300 p-2 shadow-md"
              required
            /> */}
            <MDEditor
              value={form.content}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, content: value }))
              }
              height={300}
              preview="edit"
              className="rounded-md"
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
          {editId && (
            <Button type="button" black onClick={resetForm} className="w-full">
              Болих
            </Button>
          )}
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
                  onClick={() => handleDelete(info._id)}
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
