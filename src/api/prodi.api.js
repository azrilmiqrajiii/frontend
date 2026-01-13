import axios from "./axios";

export const prodiAPI = {
  getDashboard: () => axios.get("/prodi/dashboard"),
  getLaporan: () => axios.get("/prodi/laporan"),
  uploadDokumen: (data) => axios.post("/prodi/upload", data)
};
