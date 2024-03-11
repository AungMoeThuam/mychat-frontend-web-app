import { ReactNode, useEffect } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../redux/store/store";
import { checkAuth } from "../../../redux/slices/authSlice";

const noNeedTokenRoutes = ["/login", "/register"];

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [query] = useSearchParams();
  const { token } = useSelector((state: RootState) => state.authSlice);
  const dispatch = useDispatch<StoreDispatch>();
  const redirect = query.get("redirect");
  useEffect(() => {
    if (token === null) dispatch(checkAuth());
  }, []);

  if (!token) {
    if (noNeedTokenRoutes.includes(location.pathname)) {
      return <>{children}</>;
    } else {
      return (
        <Navigate
          to={"/login?redirect=" + location.pathname}
          state={{ from: location }}
          replace
        />
      );
    }
  }

  if (token) {
    if (!noNeedTokenRoutes.includes(location.pathname)) {
      return <>{children}</>;
    } else {
      return (
        <Navigate
          to={redirect ? redirect : "/"}
          state={{ from: location }}
          replace
        />
      );
    }
  }
}
