import { Outlet } from "react-router-dom";
import NavBar from "../components/page-components/friends-page/NavBar";

export default function FriendsPage() {
  return (
    <div style={{ height: "100dvh" }} className="flex flex-col">
      <NavBar />
      <Outlet />
    </div>
  );
}
