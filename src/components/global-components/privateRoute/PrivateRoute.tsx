import { ReactNode, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../redux/store/store";
import { checkAuth } from "../../../redux/slices/authSlice";
import socket from "../../../services/socket";
import { backendUrlWihoutApiEndpoint } from "../../../utils/backendConfig";
import axios, { AxiosError } from "axios";

export async function checkBackendServerIsRunning() {
  try {
    await axios.get(`${backendUrlWihoutApiEndpoint}/server`);
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

    isServerActive();

    if (token === null) dispatch(checkAuth());

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
