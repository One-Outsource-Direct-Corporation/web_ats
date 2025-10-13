import { Outlet } from "react-router-dom";
import { Navbar } from "@/shared/components/reusables/Navbar";
import { ToastContainer } from "react-toastify";

export default function RootLayout() {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <main className="min-h-screen pt-16">
        <Outlet />
      </main>
    </>
  );
}
