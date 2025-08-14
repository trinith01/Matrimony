import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";

const api = axios.create({
  //  baseURL: API_BASE_URL,
  baseURL: "https://matrimony-mrq1.onrender.com",
});

export default api;
