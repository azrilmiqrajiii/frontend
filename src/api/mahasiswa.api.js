import axios from "./axios";

export const mahasiswaAPI = {
  changePassword: (data) => axios.put("/mahasiswa/change-password", data),
  updateProfile: (data) => axios.put("/mahasiswa/profile", data),
};
