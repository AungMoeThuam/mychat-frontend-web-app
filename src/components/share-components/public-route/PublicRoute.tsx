import { ReactNode, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../../redux/store/store";
import { checkLoginStatus } from "../../../redux/features/user/userSlice";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const [query] = useSearchParams();
  const { token } = useSelector((state: RootState) => state.authSlice);
  const redirect = query.get("redirect");
  const dispatch = useDispatch<StoreDispatch>();

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [token]);

  if (token) return <Navigate to={redirect ? redirect : "/"} replace />;

  return children;
}
