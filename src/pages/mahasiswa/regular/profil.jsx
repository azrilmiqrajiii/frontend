import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  User,
  Mail,
  GraduationCap,
  CalendarDays,
  Pencil,
  Save,
  X,
} from "lucide-react";

const PRODI_LABEL = {
  SENI_KULINER: "Seni Kuliner",
  DIVISI_KAMAR: "Divisi Kamar",
  TATA_HIDANG: "Tata Hidang",
  USAHA_PERJALANAN_WISATA: "Usaha Perjalanan Wisata",
};

export default function ProfilMahasiswa() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/auth/me");
      setUser(res.data);
      setForm(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    if (!form.name) return alert("Nama wajib diisi");

    try {
      setSaving(true);

      const res = await axios.put("/mahasiswa/profile", {
        name: form.name,
        nim: form.nim,
        semester: form.semester,
        departemen: form.departemen,
      });

      setUser(res.data.data);
      setEdit(false);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update profil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-500">Memuat profil...</div>;
  }

  if (!user) {
    return <div className="text-sm text-red-500">Gagal memuat profil</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Profil Mahasiswa
          </h2>
          <p className="text-sm text-slate-500">
            Informasi akun dan data akademik mahasiswa
          </p>
        </div>

        {!edit && (
          <button
            onClick={() => setEdit(true)}
            className="flex items-center gap-2 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            <Pencil size={16} />
            Edit
          </button>
        )}

        {edit && (
          <div className="flex gap-2">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="flex items-center gap-2 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg"
            >
              <Save size={16} />
              {saving ? "Menyimpan..." : "Simpan"}
            </button>

            <button
              onClick={() => {
                setEdit(false);
                setForm(user);
              }}
              className="flex items-center gap-2 text-sm border px-4 py-2 rounded-lg"
            >
              <X size={16} />
              Batal
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
        <div className="flex items-center gap-4">
          <User className="text-emerald-500" size={22} />
          <div className="w-full">
            <p className="text-xs text-slate-500">Nama</p>
            {edit ? (
              <input
                value={form.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="font-medium text-slate-800">{user.name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Mail className="text-indigo-500" size={22} />
          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="font-medium text-slate-800">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <GraduationCap className="text-purple-500" size={22} />
          <div className="w-full">
            <p className="text-xs text-slate-500">NIM</p>
            {edit ? (
              <input
                value={form.nim || ""}
                onChange={(e) => handleChange("nim", e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="font-medium text-slate-800">{user.nim || "-"}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <GraduationCap className="text-orange-500" size={22} />
          <div>
            <p className="text-xs text-slate-500">Program Studi</p>
            <p className="font-medium text-slate-800">
              {PRODI_LABEL[user.prodi] || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <CalendarDays className="text-emerald-500" size={22} />
          <div className="w-full">
            <p className="text-xs text-slate-500">Semester</p>
            {edit ? (
              <input
                type="number"
                value={form.semester || ""}
                onChange={(e) => handleChange("semester", e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="font-medium text-slate-800">
                {user.semester || "-"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <CalendarDays className="text-sky-500" size={22} />
          <div className="w-full">
            <p className="text-xs text-slate-500">Departemen</p>
            {edit ? (
              <input
                value={form.departemen || ""}
                onChange={(e) => handleChange("departemen", e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="font-medium text-slate-800">
                {user.departemen || "-"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
