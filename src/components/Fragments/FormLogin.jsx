import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Button from "../Elements/Button"
import InputForm from "../Elements/Input"
import { authAPI } from "../../api"
import useAuth from "../../context/useAuth"
import { useNavigate } from "react-router-dom"

const FormLogin = () => {
  const { refreshUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi")
      return
    }

    if (!validateEmail(form.email)) {
      setError("Format email tidak valid")
      return
    }

    setError("")
    setLoading(true)

    try {
      await authAPI.login({
        email: form.email.trim(),
        password: form.password,
      })

      await refreshUser()
      navigate("/mahasiswa/dashboard", { replace: true })
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Login gagal. Silakan coba lagi."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
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
        disabled={loading}
      />

      <div className="relative">
        <InputForm
          htmlFor="password"
          title="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9.5 text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
          disabled={loading}
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={loading}
        disabled={loading}
      >
        Masuk
      </Button>
    </form>
  )
}

export default FormLogin
