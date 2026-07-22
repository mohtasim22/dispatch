import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import BookParcel from "../pages/dashboard/BookParcel";
import MyParcels from "../pages/dashboard/MyParcels";
import ManageUsers from "../pages/dashboard/ManageUsers";
import AdminRoute from "./AdminRoute";
import RiderRoute from "./RiderRoute";
import BecomeRider from "../pages/dashboard/BecomeRider";
import ApproveRiders from "../pages/dashboard/ApproveRiders";
import AllParcels from "../pages/dashboard/AllParcels";
import AssignedDeliveries from "../pages/dashboard/AssignedDeliveries";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      { index: true, element: <Home></Home> },
      { path: "login", element: <Login></Login> },
      { path: "register", element: <Register></Register> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome></DashboardHome> },
      { path: "book", element: <BookParcel /> },
      { path: "parcels", element: <MyParcels /> },
      {
        path: "users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      { path: "be-a-rider", element: <BecomeRider /> },
      {
        path: "riders",
        element: (
          <AdminRoute>
            <ApproveRiders />
          </AdminRoute>
        ),
      },
      {
        path: "all-parcels",
        element: (
          <AdminRoute>
            <AllParcels />
          </AdminRoute>
        ),
      },
      {
        path: "tasks",
        element: (
          <RiderRoute>
            <AssignedDeliveries />
          </RiderRoute>
        ),
      },
    ],
  },
]);

export default router;
