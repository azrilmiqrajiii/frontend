import { useState } from "react";
import Button from "../Elements/Button";
import InputForm from "../Elements/Input";
import { authAPI } from "../../api";
import useAuth from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

const FormLogin = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await authAPI.login({
        email: form.email,
        password: form.password,
      });

      await refreshUser();
      navigate("/mahasiswa/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login gagal. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-100 text-red-700 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <InputForm
        htmlFor="email"
        title="Email"
        type="email"
        name="email"
        placeholder="example@poltekpar.ac.id"
        value={form.email}
        onChange={handleChange}
      />

      <InputForm
        htmlFor="password"
        title="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        value={form.password}
        onChange={handleChange}
      />

      <Button type="submit" className="w-full" loading={loading}>
        Masuk
      </Button>
    </form>
  );
};

export default FormLogin;
