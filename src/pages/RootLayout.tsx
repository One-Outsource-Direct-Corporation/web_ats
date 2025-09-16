import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/reusables/Navbar";

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
