import axios from "./axios";

export const prestasiMahasiswaAPI = {
  list: (prodi, jenis, tahun) =>
    axios.get(`/prestasi-mahasiswa/${prodi}/${jenis}`, { params: { tahun } }),

  create: (data) => axios.post("/prestasi-mahasiswa", data),

  upload: (id, file) => {
    const form = new FormData();
    form.append("file", file);
    return axios.post(`/prestasi-mahasiswa/${id}/upload`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  remove: (id) => axios.delete(`/prestasi-mahasiswa/${id}`),
};
