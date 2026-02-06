import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../context/useAuth";
import Button from "../../../components/Elements/Button";
import InputForm from "../../../components/Elements/Input";

export default function OnboardingProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nim: "",
    semester: "",
    departemen: "",
    peran: "REGULER",
    periodePraktik: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const values = Object.values(form);
    if (values.some((v) => !v)) return setError("Semua data wajib diisi");

    setUser({
      ...user,
      ...form,
      profileComplete: true,
    });

    navigate("/mahasiswa/dashboard", { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">Lengkapi Profil Mahasiswa</h1>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <InputForm
          title="NIM"
          name="nim"
          value={form.nim}
          onChange={handleChange}
        />

        <InputForm
          title="Semester"
          name="semester"
          type="number"
          value={form.semester}
          onChange={handleChange}
        />

        <InputForm
          title="Departemen"
          name="departemen"
          value={form.departemen}
          onChange={handleChange}
        />

        <div>
          <label className="text-sm font-medium">Peran</label>
          <select
            name="peran"
            value={form.peran}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          >
            <option value="REGULER">Reguler</option>
            <option value="MAGANG">Magang</option>
            <option value="PKL">PKL</option>
          </select>
        </div>

        <div className="col-span-2">
          <InputForm
            title="Periode Praktik"
            name="periodePraktik"
            value={form.periodePraktik}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-2">
          <Button type="submit" className="w-full">
            Simpan Profil
          </Button>
        </div>
      </form>
    </div>
  );
}
