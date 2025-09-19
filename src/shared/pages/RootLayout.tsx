import { Outlet } from "react-router-dom";
import { Navbar } from "@/shared/components/reusables/Navbar";
import ProtectedRoutes from "@/features/auth/components/ProtectedRoutes";

export default function RootLayout() {
  return (
    <ProtectedRoutes>
      <>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </>
    </ProtectedRoutes>
  );
}
