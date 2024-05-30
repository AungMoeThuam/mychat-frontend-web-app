import axios from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const backendUrl = "http://localhost:4000/api";
export const backendUrlWihoutApiEndpoint = "http://localhost:4000";
export const socketUrl = "http://localhost:4000";

const { getStorage } = useLocalStorage("authToken");

const API = axios.create({
  baseURL: backendUrl,
});

API.interceptors.request.use((req) => {
  const credential = getStorage();
  if (credential) req.headers.Authorization = "bearer " + credential.token;
  return req;
});

export default API;
