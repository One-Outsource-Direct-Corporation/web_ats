import type { Applicant } from "../types/applicant.types";

export async function getApplicants(): Promise<Applicant[]> {
  // TODO: Replace with actual API call
  return [
    {
      id: "1",
      name: "Maria White",
      email: "maria.white@email.com",
      status: "Hired",
      position: "Project Manager",
      department: "CI",
      type: "Full Time",
      avatar: "https://i.pravatar.cc/40?u=1",
    },
    {
      id: "2",
      name: "Carmen Martinez",
      email: "carmen.martinez@email.com",
      status: "Failed",
      position: "Social Media Manager",
      department: "Marketing",
      type: "Full Time",
      avatar: "https://i.pravatar.cc/40?u=2",
    },
    {
      id: "3",
      name: "Olivia Miller",
      email: "olivia.miller@email.com",
      status: "Warm",
      position: "Senior UI/UX Designer",
      department: "CI",
      type: "Full Time",
      avatar: "https://i.pravatar.cc/40?u=3",
    },
  ];
}
