import axios from "./axios";

export const visiMisiAPI = {
  get: (prodi, tahun) => axios.get(`/visi-misi/${prodi}/${tahun}`),
  save: (prodi, form) => axios.post(`/visi-misi/${prodi}`, form),
  remove: (id) => axios.delete(`/visi-misi/${id}`),
};
