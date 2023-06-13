import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UserFormContainer from "./UserForm";
import UserTableContainer from "./UserTable";

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <UserTableContainer />,
    },
    {
      path: "form",
      element: <UserFormContainer />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
