import { useState } from "react";
import { mahasiswaAPI } from "../../../api/mahasiswa.api";
import useAuth from "../../../context/useAuth";

export default function ProfileMahasiswa() {
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    nim: "",
    semester: "",
    departemen: "",
    peran: "",
    prodi: "",
    periodePraktik: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await mahasiswaAPI.updateProfile(form);

      const res = await fetch(import.meta.env.VITE_API_URL + "/auth/me", {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user);

      window.location.href = "/mahasiswa";
    } catch (err) {
      setError(err.response?.data?.message || "Gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-6">Lengkapi Profil Mahasiswa</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          name="nim"
          placeholder="NIM"
          onChange={change}
          className="input"
        />
        <input
          name="semester"
          type="number"
          placeholder="Semester"
          onChange={change}
          className="input"
        />
        <input
          name="departemen"
          placeholder="Departemen"
          onChange={change}
          className="input"
        />

        <select name="peran" onChange={change} className="input">
          <option value="">Pilih Peran</option>
          <option value="REGULER">Reguler</option>
          <option value="MAGANG">Magang</option>
          <option value="PKL">PKL</option>
        </select>

        <select name="prodi" onChange={change} className="input">
          <option value="">Pilih Prodi</option>
          <option value="TATA_HIDANG">Tata Hidang</option>
          <option value="DIVISI_KAMAR">Divisi Kamar</option>
          <option value="SENI_KULINER">Seni Kuliner</option>
          <option value="USAHA_PERJALANAN_WISATA">
            Usaha Perjalanan Wisata
          </option>
        </select>

        <input
          name="periodePraktik"
          placeholder="Periode Praktik (contoh: 2025 Genap)"
          onChange={change}
          className="input"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </form>
    </div>
  );
}
