import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mahasiswaAPI } from "../../api/mahasiswa.api";
import Button from "../../components/Elements/Button";
import OnboardingStepper from "../../components/Fragments/OnBoardingStepper";
import useAuth from "../../context/useAuth";

export default function ChangePassword() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = () => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8)
      return setError("Password minimal 8 karakter");

    if (form.password !== form.confirm)
      return setError("Konfirmasi password tidak cocok");

    setLoading(true);
    try {
      await mahasiswaAPI.changePassword({
        newPassword: form.password,
      });

      await mahasiswaAPI.changePassword({
        newPassword: form.password,
      });
      await refreshUser();
      navigate("/mahasiswa/complete-profile", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengganti password");
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-400",
    "bg-green-600",
  ];

  return (
    <div className="flex justify-center pt-14">
      <div className="w-full max-w-md">
        <OnboardingStepper step={1} />

        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-xl bg-white p-6  shadow-sm"
        >
          <h1 className="text-xl font-semibold text-slate-800">
            Ganti Password
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Password baru wajib aman dan mudah diingat
          </p>

          {error && (
            <div className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Password Baru
              </label>
              <div className="relative mt-1">
                <input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full rounded border border-slate-300 px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-sm "
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-2.5 text-xs font-medium text-slate-500"
                >
                  {show ? "HIDE" : "SHOW"}
                </button>
              </div>

              <div className="mt-2 h-1 w-full rounded bg-slate-200">
                <div
                  className={`h-1 rounded transition-all ${
                    strength() > 0 ? colors[strength() - 1] : ""
                  }`}
                  style={{ width: `${strength() * 25}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Gunakan kombinasi huruf besar, angka, dan simbol
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Konfirmasi Password
              </label>
              <input
                type={show ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Ulangi password"
              />
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan & Lanjutkan"}
          </Button>
        </form>
      </div>
    </div>
  );
}
