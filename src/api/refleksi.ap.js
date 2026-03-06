import axios from "./axios";

export const refleksiAPI = {
  create: (formData) =>
    axios.post("/api/refleksi", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAll: () => axios.get("/api/refleksi"),
};
