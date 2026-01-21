import { UploadCloud, FileText, X } from "lucide-react"

export default function FileDrop({ file, setFile, label, accept, onRemove }) {
  const isUrl = typeof file === "string"

  const fileName = isUrl
    ? decodeURIComponent(file.split("/").pop())
    : file?.name

  const fileSize = !isUrl && file
    ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
    : null

  return (
    <div className="space-y-3">
      {label && <p className="text-sm text-slate-500">{label}</p>}

      {!file && (
        <label className="group flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 rounded-2xl p-8 cursor-pointer transition hover:border-[#1E6F9F] hover:bg-[#1E6F9F]/5">
          <UploadCloud
            size={36}
            className="text-slate-400 group-hover:text-[#1E6F9F]"
          />
          <div className="text-center">
            <p className="text-sm">
              <span className="font-semibold text-[#1E6F9F]">
                Klik upload
              </span>{" "}
              atau drag & drop
            </p>
            <p className="text-xs text-slate-400">{accept}</p>
          </div>

          <input
            type="file"
            accept={accept}
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="hidden"
          />
        </label>
      )}

      {file && (
        <div className="flex items-center justify-between bg-slate-100 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileText size={20} className="text-[#1E6F9F]" />
            <div className="min-w-0">
              {isUrl ? (
                <a
                  href={file}
                  target="_blank"
                  className="block truncate text-sm font-medium text-[#1E6F9F] underline"
                >
                  {fileName}
                </a>
              ) : (
                <p className="truncate text-sm font-medium">{fileName}</p>
              )}
              {fileSize && (
                <p className="text-xs text-slate-500">{fileSize}</p>
              )}
            </div>
          </div>

          <button
            onClick={onRemove || (() => setFile(null))}
            className="text-slate-400 hover:text-red-500"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
