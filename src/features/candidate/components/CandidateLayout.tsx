import { Outlet } from "react-router-dom";
import CandidateNavbar from "./CandidateNavbar";

export default function CandidateLayout() {
  return (
    <>
      <CandidateNavbar />
      <main className="min-h-screen pt-16">
        <Outlet />
      </main>
    </>
  );
}
