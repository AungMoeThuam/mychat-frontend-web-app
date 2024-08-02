import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import Chat from "../pages/ChatPage";
import Setting from "../pages/Setting";
import FriendsPage from "../pages/FriendsPage";
import FriendPageMain from "../components/friends/friendPageMain/FriendPageMain";
import PendingsPage from "../pages/PendingsPage";
import RequestsPage from "../pages/RequestsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import BlocksPage from "../pages/BlocksPage";
import CallAcceptedPage from "../pages/CallAccepted";
import CallRequestedPage from "../pages/CallRequested";
import ProfilePage from "../pages/ProfilePage";
import SearchPeoplePage from "../pages/SearchPeoplePage";
import ServerDownPage from "../pages/ServerDownPage";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <HomePage />
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
        element: <FriendsPage />,
        children: [
          {
            index: true,
            element: <FriendPageMain />,
          },
          {
            path: "pendings",
            element: <PendingsPage />,
          },

          {
            path: "requests",
            element: <RequestsPage />,
          },
          {
            path: "addfriends",
            element: <SearchPeoplePage />,
          },
          {
            path: "blocks",
            element: <BlocksPage />,
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
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/call-room-type=audio:initiate=true/:friendId/:calleeName",
    element: (
      <PrivateRoute>
        <CallRequestedPage callRoomType="audio" />
      </PrivateRoute>
    ),
  },
  {
    path: "/call-room-type=video:initiate=true/:friendId/:calleeName",
    element: (
      <PrivateRoute>
        <CallRequestedPage />
      </PrivateRoute>
    ),
  },

  {
    path: "/call-room-type=video:initiate=false/:callerId/:calleeId/:callerName",
    element: (
      <PrivateRoute>
        <CallAcceptedPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/call-room-type=audio:initiate=false/:callerId/:calleeId/:callerName",
    element: (
      <PrivateRoute>
        <CallAcceptedPage callRoomType="audio" />
      </PrivateRoute>
    ),
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: "/serverdown",
    element: <ServerDownPage />,
  },
]);

export default router;
