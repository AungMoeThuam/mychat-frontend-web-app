import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className=" flex gap-4 px-10 py-3">
      <NavLink
        end
        to={"/friends"}
        className={({ isActive }) => {
          return isActive
            ? " bg-teal-600  text-slate-950 py-2 px-5  rounded-lg"
            : "py-2 px-5";
        }}
      >
        Friends
      </NavLink>
      <NavLink
        to={"/friends/addfriends"}
        className={({ isActive }) => {
          return isActive
            ? " bg-teal-600  text-slate-950 py-2 px-5  rounded-lg"
            : "py-2 px-5";
        }}
      >
        Add Friend
      </NavLink>
      <NavLink
        to={"/friends/requests"}
        className={({ isActive }) => {
          return isActive
            ? " bg-teal-600  text-slate-950 py-2 px-5  rounded-lg"
            : "py-2 px-5";
        }}
      >
        Requests
      </NavLink>
      <NavLink
        to={"/friends/pendings"}
        className={({ isActive }) => {
          return isActive
            ? " bg-teal-600  text-slate-950 py-2 px-5  rounded-lg"
            : "py-2 px-5";
        }}
      >
        Pendings
      </NavLink>
      <NavLink
        to={"/friends/blocks"}
        className={({ isActive }) => {
          return isActive
            ? " bg-teal-600  text-slate-950 py-2 px-5  rounded-lg"
            : "py-2 px-5";
        }}
      >
        Blocks
      </NavLink>
    </nav>
  );
}
