import axios from "./axios";

export const kurikulumAPI = {
  get: (prodi, tahun) => axios.get(`/kurikulum/${prodi}/${tahun}`),

  save: (prodi, form) =>
    axios.post(`/kurikulum/${prodi}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  uploadRps: (prodi, matkulId, form) =>
    axios.post(`/kurikulum/${prodi}/rps/${matkulId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  removeRps: (prodi, matkulId, tahun) =>
    axios.delete(`/kurikulum/${prodi}/rps/${matkulId}/${tahun}`),
};
