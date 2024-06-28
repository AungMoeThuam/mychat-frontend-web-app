import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Chat from "./pages/chat/ChatPage.tsx";
import HomePage from "./pages/home/HomePage.tsx";

import LoginPage from "./pages/login/LoginPage.tsx";
import PrivateRoute from "./components/share-components/private-route/PrivateRoute.tsx";
import { Provider } from "react-redux";
import store from "./redux/store/store.ts";
import FriendsPage from "./pages/friends/FriendsPage.tsx";
import RequestsPage from "./pages/requests/RequestsPage.tsx";
import FriendPageMain from "./components/friends/friendPageMain/FriendPageMain.tsx";
import SearchPeoplePage from "./pages/search-people/SearchPeoplePage.tsx";
import RegisterPage from "./pages/register/RegisterPage.tsx";
import PendingsPage from "./pages/pendings/PendingsPage.tsx";
import PublicRoute from "./components/share-components/public-route/PublicRoute.tsx";
import ServerDownPage from "./pages/serverdown/ServerDownPage.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";
import BlocksPage from "./pages/blocks/BlocksPage.tsx";
import Setting from "./pages/Setting.tsx";
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
