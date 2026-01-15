import { useEffect, useState, useCallback } from "react"
import useAuth from "../../context/useAuth"
import { visiMisiAPI } from "../../api/visiMisi.api"
import Button from "../../components/Elements/Button"
import FileDrop from "../../components/Fragments/FileDrop"

const YEARS = ["2020","2021","2022","2023","2024","2025","2026"]

export default function VisiMisi() {
  const { user } = useAuth()
  const [year, setYear] = useState("2026")
  const [visi, setVisi] = useState("")
  const [misi, setMisi] = useState("")
  const [file, setFile] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!user) return
    const res = await visiMisiAPI.get(user.prodi, year)
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
  }, [user, year])

  useEffect(() => {
    load()
  }, [load])

  const save = async () => {
    setLoading(true)
    const f = new FormData()
    f.append("visi", visi)
    f.append("misi", misi)
    f.append("tahun", year)
    if (file) f.append("file", file)
    await visiMisiAPI.save(user.prodi, f)
    await load()
    setLoading(false)
  }

  const remove = async () => {
    await visiMisiAPI.remove(data._id)
    setVisi("")
    setMisi("")
    setData(null)
    setFile(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D62]">Visi & Misi</h1>
          <p className="text-slate-500">Pernyataan resmi program studi</p>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-6 py-3 rounded-xl bg-white shadow"
        >
          {YEARS.map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-10 space-y-8">
        <textarea
          value={visi}
          onChange={(e) => setVisi(e.target.value)}
          className="w-full h-40 p-6 rounded-2xl bg-slate-100"
          placeholder="Visi Program Studi"
        />

        <textarea
          value={misi}
          onChange={(e) => setMisi(e.target.value)}
          className="w-full h-40 p-6 rounded-2xl bg-slate-100"
          placeholder="Misi Program Studi"
        />

        <FileDrop
          file={file}
          setFile={setFile}
          label="Dokumen Pendukung Visi & Misi"
        />

        <div className="flex gap-4">
          <Button
            onClick={save}
            loading={loading}
            className="px-10 py-3 rounded-xl bg-[#1E6F9F] text-white"
          >
            Simpan
          </Button>

          {data && (
            <Button
              onClick={remove}
              className="px-8 py-3 rounded-xl bg-red-500 text-white"
            >
              Hapus
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
