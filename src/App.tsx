import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "@/App.css";

export default function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}
