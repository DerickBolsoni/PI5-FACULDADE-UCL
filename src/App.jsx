import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MapHome } from "./pages/MapHome.jsx";
import { AdminCenter } from "./pages/AdminCenter.jsx";

const router = createBrowserRouter([
  { path: "/", element: <MapHome /> },
  { path: "/admin", element: <AdminCenter /> },
]);

export function App() {
  return <RouterProvider router={router} />;
}
