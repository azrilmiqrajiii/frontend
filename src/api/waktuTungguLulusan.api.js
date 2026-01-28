import axios from "./axios";

export const waktuTungguLulusanAPI = {
  get: (prodi, tahun) => axios.get(`/waktu-tunggu-lulusan/${prodi}/${tahun}`),

  save: (prodi, data) => axios.post(`/waktu-tunggu-lulusan/${prodi}`, data),
};
