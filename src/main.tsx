import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Chat from "./components/chat/Chat.tsx";
import HomePage from "./pages/home/Home.page.tsx";
import ProfilePage from "./pages/profile/Profile.page.tsx";
import LoginPage from "./pages/login/Login.page.tsx";
import PrivateRoute from "./components/privateRoute/PrivateRoute.tsx";
import { Provider } from "react-redux";
import store from "./redux/store/store.ts";
import FriendsPage from "./pages/friends/Friends.page.tsx";
import RequestsPage from "./pages/requests/Requests.page.tsx";
import FriendPageMain from "./components/friends/friendPageMain/FriendPageMain.tsx";
import AddFriendsPage from "./pages/addfriends/AddFriends.page.tsx";
import RegisterPage from "./pages/register/Register.page.tsx";
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
        path: "/messages/:roomId",
        element: <Chat />,
      },
      {
        path: "/setting",
        element: <div>Setting</div>,
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
            path: "requests",
            element: <RequestsPage />,
          },
          {
            path: "addfriends",
            element: <AddFriendsPage />,
            // children: [{ path: ":name", element: <AddFriendsPage /> }],
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
      <PrivateRoute>
        <LoginPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PrivateRoute>
        <RegisterPage />
      </PrivateRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
