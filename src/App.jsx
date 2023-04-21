import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import store from "@/redux/store";
import Layout from "@/component/Layout";
import Auth from "@/component/Auth";
import Home from "@/component/Home";
import Room from "@/component/Room";
import RoomWrapper from "@/component/Room/RoomWrapper";
import Login from "@/component/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Auth />,
        children: [
          {
            path: "/",
            element: <Home />,
            index: true,
          },
          {
            path: "/room",
            element: <RoomWrapper />,
            children: [
              {
                path: "/room",
                element: <>loading</>,
              },
              {
                path: "/room/:roomId",
                element: <Room />,
              },
            ],
          },
        ],
      },
      {
        path: "/Login",
        element: <Login />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
