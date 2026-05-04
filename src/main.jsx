import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MapHome } from "./pages/MapHome.jsx";
import { AdminCenter } from "./pages/AdminCenter.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import "./index.css";

const router = createBrowserRouter(
  [
    { path: "", element: <MapHome /> },
    { path: "admincenter", element: <AdminCenter /> },
    { path: "*", element: <NotFound /> },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
