import axios from "./axios";

export const capaianPembelajaranAPI = {
  list: (prodi) => axios.get(`/capaian-pembelajaran/${prodi}`),

  bulkSave: (prodi, rows) =>
    axios.post(`/capaian-pembelajaran/${prodi}/bulk`, { rows }),

  uploadSk: (id, file) => {
    const f = new FormData();
    f.append("file", file);
    return axios.post(`/capaian-pembelajaran/${id}/upload-sk`, f);
  },

  remove: (id) => axios.delete(`/capaian-pembelajaran/${id}`),
};
