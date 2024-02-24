import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../redux/store/store";
import { checkAuth } from "../../redux/slice/authSlice";

const noNeedTokenRoutes = ["/login", "/register"];

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  // const token = getStorage().token;
  const { token } = useSelector((state: RootState) => state.authSlice);
  const dispatch = useDispatch<StoreDispatch>();

  useEffect(() => {
    if (token === null) dispatch(checkAuth());
  }, []);

  if (!token) {
    if (noNeedTokenRoutes.includes(location.pathname)) {
      return <>{children}</>;
    } else {
      return <Navigate to={"/login"} state={{ from: location }} replace />;
    }
  }

  if (token) {
    if (!noNeedTokenRoutes.includes(location.pathname)) {
      return <>{children}</>;
    } else {
      return <Navigate to={"/"} state={{ from: location }} replace />;
    }
  }
}
