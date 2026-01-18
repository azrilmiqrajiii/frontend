import axios from "./axios";

export const kurikulumAPI = {
  get: (prodi, tahun) => axios.get(`/kurikulum/${prodi}/${tahun}`),
  save: (prodi, form) => axios.post(`/kurikulum/${prodi}`, form),
};
