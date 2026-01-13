import axios from "./axios";

export const authAPI = {
  login: (data) => axios.post("/auth/login", data),
  me: () => axios.get("/auth/me"),
  logout: () => axios.post("/auth/logout") 
};
