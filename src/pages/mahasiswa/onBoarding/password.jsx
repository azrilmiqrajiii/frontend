import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../context/useAuth";
import Button from "../../../components/Elements/Button";
import InputForm from "../../../components/Elements/Input";

export default function OnboardingPassword() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password.length < 8)
      return setError("Password minimal 8 karakter");

    if (form.password !== form.confirm)
      return setError("Konfirmasi password tidak sama");

    setUser({
      ...user,
      passwordChanged: true,
    });

    navigate("/mahasiswa", { replace: true });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-2">Ganti Password Pertama</h1>

      <p className="text-sm text-slate-600 mb-6">
        Demi keamanan akun, silakan ganti password default Anda.
      </p>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputForm
          title="Password Baru"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <InputForm
          title="Konfirmasi Password"
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
        />

        <Button type="submit" className="w-full">
          Simpan Password
        </Button>
      </form>
    </div>
  );
}
