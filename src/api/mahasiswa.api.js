import axios from "./axios";

export const mahasiswaAPI = {
  changePassword: (data) => axios.post("/mahasiswa/change-password", data),
  completeProfile: (data) => axios.post("/mahasiswa/complete-profile", data),
};
