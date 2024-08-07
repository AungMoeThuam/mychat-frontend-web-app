import { ReactNode, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios, { AxiosError } from "axios";
import { checkLoginStatus } from "../redux/features/user/userSlice";
import { RootState, StoreDispatch } from "../redux/store/store";
import { API_BASE_URL } from "../service/api";
import socket from "../service/socket.service";
export async function checkBackendServerIsRunning() {
  try {
    await axios.get(`${API_BASE_URL}/server`);
    return true;
  } catch (error) {
    if (error instanceof AxiosError) return false;
  }
}

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { token } = useSelector((state: RootState) => state.authSlice);
  const dispatch = useDispatch<StoreDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    async function isServerActive() {
      const res = await checkBackendServerIsRunning();
      if (!res) navigate("/serverdown");
    }

    let savedMode = localStorage.getItem("mode");
    if (savedMode === "dark")
      return document.body.querySelector("#root")?.classList.add("dark");

    isServerActive();

    if (token === null) dispatch(checkLoginStatus());

    let id = setInterval(() => {
      isServerActive();
      if (socket.io.active === false) socket.io.connect();
    }, 30000);
    return () => {
      console.log("clear time out for socket", socket.io.active);
      clearInterval(id);
    };
  }, [token]);

  if (!token) return <Navigate to={"/login?redirect=" + location.pathname} />;
  else return children;
}
