import { UploadCloud, FileText, X } from "lucide-react";

export default function FileDrop({ file, setFile, label, accept }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">{label}</p>

      <label className="group flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 rounded-2xl p-8 cursor-pointer transition hover:border-blue-500 hover:bg-blue-50">
        <UploadCloud
          size={36}
          className="text-slate-400 group-hover:text-blue-600"
        />
        <div className="text-center">
          <p className="text-sm">
            <span className="font-semibold text-blue-600">Klik upload</span>{" "}
            atau drag & drop
          </p>
          <p className="text-xs text-slate-400">{accept}</p>
        </div>

        <input
          type="file"
          accept={accept}
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>

      {file && (
        <div className="flex items-center justify-between bg-slate-100 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-blue-600" />
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-slate-400 hover:text-red-500"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
