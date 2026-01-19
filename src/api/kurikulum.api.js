import axios from "./axios";

export const kurikulumAPI = {
  get: (prodi, tahun) => axios.get(`/kurikulum/${prodi}/${tahun}`),

  save: (prodi, form) =>
    axios.post(`/kurikulum/${prodi}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  uploadRps: (prodi, index, form) =>
    axios.post(`/kurikulum/${prodi}/rps/${index}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
