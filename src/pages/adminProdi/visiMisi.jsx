import { useEffect, useState, useCallback } from "react"
import useAuth from "../../context/useAuth"
import { visiMisiAPI } from "../../api/visiMisi.api"
import Button from "../../components/Elements/Button"
import FileDrop from "../../components/Fragments/FileDrop"

const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"]

export default function VisiMisi() {
  const { user } = useAuth()
  const [year, setYear] = useState("2026")
  const [visi, setVisi] = useState("")
  const [misi, setMisi] = useState("")
  const [file, setFile] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const load = useCallback(async () => {
    if (!user) return
    try {
      const res = await visiMisiAPI.get(user.prodi, Number(year))
      if (res.data) {
        setData(res.data)
        setVisi(res.data.visi || "")
        setMisi(res.data.misi || "")
      } else {
        setData(null)
        setVisi("")
        setMisi("")
      }
      setFile(null)
      setErrors({})
    } catch {
      setData(null)
    }
  }, [user, year])

  useEffect(() => {
    load()
  }, [load])

  const validate = () => {
    const e = {}
    if (!visi.trim()) e.visi = "Visi wajib diisi"
    else if (visi.trim().length < 40) e.visi = "Minimal 40 karakter"

    if (!misi.trim()) e.misi = "Misi wajib diisi"
    else if (misi.trim().length < 80) e.misi = "Minimal 80 karakter"

    if (file) {
      if (file.type !== "application/pdf") e.file = "File harus PDF"
      if (file.size > 5 * 1024 * 1024) e.file = "Maksimal 5MB"
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = async () => {
    if (!validate()) return
    try {
      setLoading(true)
      const f = new FormData()
      f.append("visi", visi.trim())
      f.append("misi", misi.trim())
      f.append("tahun", Number(year))
      if (file) f.append("file", file)
      await visiMisiAPI.save(user.prodi, f)
      await load()
    } finally {
      setLoading(false)
    }
  }

  const remove = async () => {
    await visiMisiAPI.remove(data._id)
    setVisi("")
    setMisi("")
    setData(null)
    setFile(null)
    setErrors({})
  }

  const textareaClass = (err) =>
    `w-full rounded-2xl border px-6 py-5 text-sm text-slate-700
     transition outline-none resize-none
     focus:ring-2 focus:ring-[#1E6F9F]/30 focus:border-[#1E6F9F]
     ${err ? "border-red-400 focus:ring-red-400/30" : "border-slate-300"}`

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
            Visi & Misi Program Studi
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Pernyataan strategis dan arah pengembangan program studi
          </p>

          <div className="mt-3">
            {data ? (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600">
                ● Data tersedia
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400">
                ● Belum tersedia
              </span>
            )}
          </div>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-5 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E6F9F]/30"
        >
          {YEARS.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-10 space-y-10">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Visi
          </h2>

          <textarea
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            onBlur={validate}
            className={textareaClass(errors.visi) + " h-44"}
            placeholder="Tuliskan visi program studi"
          />

          <p className={`text-xs ${errors.visi ? "text-red-500" : "text-slate-400"}`}>
            {errors.visi || "Minimal 40 karakter"}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Misi
          </h2>

          <textarea
            value={misi}
            onChange={(e) => setMisi(e.target.value)}
            onBlur={validate}
            className={textareaClass(errors.misi) + " h-52"}
            placeholder="Tuliskan misi program studi"
          />

          <p className={`text-xs ${errors.misi ? "text-red-500" : "text-slate-400"}`}>
            {errors.misi || "Minimal 80 karakter"}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Dokumen Pendukung (PDF)
          </h2>

          <FileDrop file={file} setFile={setFile} />

          {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}

          {data?.file && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-6 py-5">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Dokumen tersimpan
                </p>
                <p className="text-xs text-slate-500">
                  Klik untuk melihat dokumen PDF
                </p>
              </div>

              <a
                href={data.file}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1E6F9F] hover:bg-[#15557A] transition"
              >
                Lihat Dokumen
              </a>
            </div>
          )}
        </section>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            onClick={save}
            loading={loading}
            className="px-10 py-3 rounded-xl"
          >
            Simpan Perubahan
          </Button>

          {data && (
            <Button
              onClick={remove}
              className="px-10 py-3 rounded-xl bg-red-500 hover:bg-red-600"
            >
              Hapus Data
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
