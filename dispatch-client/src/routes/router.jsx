import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const router= createBrowserRouter([{
    path : "/",
    element : <RootLayout></RootLayout>,
    children: [
        { index: true, element: <Home></Home>},
        { path: "login", element: <Login></Login>},
        { path: "register", element: <Register></Register>}
    ]
}])

export default router;