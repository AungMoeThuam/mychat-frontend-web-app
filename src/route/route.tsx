import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import Chat from "../pages/Chat";
import Setting from "../pages/Setting";
import Friends from "../pages/Friends";
import FriendPageMain from "../components/friends/friendPageMain/FriendPageMain";
import Pendings from "../pages/Pendings";
import Requests from "../pages/Requests";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Blocks from "../pages/Blocks";
import CallAccepted from "../pages/CallAccepted";
import CallRequested from "../pages/CallRequested";
import Profile from "../pages/Profile";
import SearchPeople from "../pages/SearchPeople";
import ServerDown from "../pages/ServerDown";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <h1 className=" p-10 font-bold text-xl">Select a conversation </h1>
        ),
      },
      {
        path: "/messages/:roomId/:friendId",
        element: <Chat />,
      },

      {
        path: "/setting",
        element: <Setting />,
      },

      {
        path: "/friends",
        element: <Friends />,
        children: [
          {
            index: true,
            element: <FriendPageMain />,
          },
          {
            path: "pendings",
            element: <Pendings />,
          },

          {
            path: "requests",
            element: <Requests />,
          },
          {
            path: "addfriends",
            element: <SearchPeople />,
          },
          {
            path: "blocks",
            element: <Blocks />,
          },
        ],
      },
    ],
    errorElement: <div>404 not found!</div>,
  },

  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/call-room-type=audio:initiate=true/:friendId/:calleeName",
    element: (
      <PrivateRoute>
        <CallRequested callRoomType="audio" />
      </PrivateRoute>
    ),
  },
  {
    path: "/call-room-type=video:initiate=true/:friendId/:calleeName",
    element: (
      <PrivateRoute>
        <CallRequested />
      </PrivateRoute>
    ),
  },

  {
    path: "/call-room-type=video:initiate=false/:callerId/:calleeId/:callerName",
    element: (
      <PrivateRoute>
        <CallAccepted />
      </PrivateRoute>
    ),
  },
  {
    path: "/call-room-type=audio:initiate=false/:callerId/:calleeId/:callerName",
    element: (
      <PrivateRoute>
        <CallAccepted callRoomType="audio" />
      </PrivateRoute>
    ),
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/serverdown",
    element: <ServerDown />,
  },
]);

export default router;
