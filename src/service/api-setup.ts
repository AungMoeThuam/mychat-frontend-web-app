import axios from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const socketUrl = "http://localhost:4000";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log(" prcess ", import.meta.env);
const { getStorage } = useLocalStorage("authToken");

const API = axios.create({
  baseURL: API_BASE_URL + "/api",
});

API.interceptors.request.use((req) => {
  const credential = getStorage();
  if (credential) req.headers.Authorization = "bearer " + credential.token;
  return req;
});

export default API;
