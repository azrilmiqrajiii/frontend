import axios from "./axios";

export const prestasiMahasiswaAPI = {
  list: (prodi, jenis) => axios.get(`/prestasi-mahasiswa/${prodi}/${jenis}`),

  bulkSave: (prodi, jenis, rows) =>
    axios.post(`/prestasi-mahasiswa/${prodi}/${jenis}/bulk`, { rows }),

  upload: (id, file) => {
    const f = new FormData();
    f.append("file", file);
    return axios.post(`/prestasi-mahasiswa/${id}/upload`, f);
  },

  remove: (id) => axios.delete(`/prestasi-mahasiswa/${id}`),
};
