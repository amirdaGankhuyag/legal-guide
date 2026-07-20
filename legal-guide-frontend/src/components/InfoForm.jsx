import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import MDEditor from "@uiw/react-md-editor";
import {
  inputClasses,
  labelClasses,
  fileInputClasses,
  primaryBtn,
  secondaryBtn,
  editBtn,
  deleteBtn,
} from "../utils/formStyles";

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
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-6 text-center text-xl font-bold text-slate-900 dark:text-white">
          {editId ? "Мэдээлэл засах" : "Мэдээлэл нэмэх"}
        </h2>
        <form onSubmit={handleUploadData} className="space-y-5">
          <div>
            <label className={labelClasses}>Гарчиг</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Товч агуулга</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              className={inputClasses}
              rows={3}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Дэлгэрэнгүй агуулга</label>
            <MDEditor
              value={form.content}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, content: value }))
              }
              height={300}
              preview="edit"
              className="rounded-xl"
            />
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
                alt="Зургийн preview"
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

      {/* Мэдээллийн жагсаалт */}
      <div className="mt-8 space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Бүртгэлтэй мэдээллүүд
        </h3>
        {infos.map((info) => (
          <div
            key={info._id}
            className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="min-w-0">
              <h4 className="truncate font-semibold text-slate-900 dark:text-white">
                {info.title}
              </h4>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                {info.summary}
              </p>
            </div>
            <div className="ml-3 flex shrink-0 gap-2">
              <button onClick={() => handleEdit(info)} className={editBtn}>
                Засах
              </button>
              <button
                onClick={() => handleDelete(info._id)}
                className={deleteBtn}
              >
                Устгах
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoForm;
