import axios from "./axios";

export const dosenAPI = {
  changePassword: (data) => axios.post("/dosen/change-password", data),
  completeProfile: (data) => axios.post("/dosen/complete-profile", data),
};
