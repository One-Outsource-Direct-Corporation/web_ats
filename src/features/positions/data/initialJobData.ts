// All job data for Positions feature
// This file exports initialJobData for use in Positions.tsx

import type { JobPosting } from "../types/positionTypes";

const initialJobData: {
  drafts: JobPosting[];
  "on-hold": JobPosting[];
  published: {
    Internal: JobPosting[];
    External: JobPosting[];
  };
  closed: JobPosting[];
  archive: JobPosting[];
  deleted: JobPosting[];
} = {
  drafts: [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      description:
        "We are seeking an experienced Frontend Developer to join our engineering team and build cutting-edge user interfaces.",
      status: "Reopened",
    },
    {
      id: 2,
      title: "Product Marketing Manager",
      department: "Marketing",
      description:
        "Looking for a strategic Product Marketing Manager to drive go-to-market initiatives and product positioning.",
    },
    {
      id: 3,
      title: "Data Scientist",
      department: "Analytics",
      description:
        "Join our analytics team to extract insights from complex datasets and drive data-driven decision making.",
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      description:
        "We need a creative UX/UI Designer to craft intuitive and beautiful user experiences for our products.",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      department: "Engineering",
      description:
        "Seeking a DevOps Engineer to optimize our infrastructure and streamline deployment processes.",
    },
    {
      id: 6,
      title: "Business Analyst",
      department: "Operations",
      description:
        "Business Analyst to bridge the gap between business requirements and technical solutions.",
    },
    {
      id: 7,
      title: "Security Engineer",
      department: "Engineering",
      description:
        "Cybersecurity expert to protect our systems and implement security best practices.",
    },
  ],
  "on-hold": [
    {
      id: 21,
      title: "Mobile App Developer",
      department: "Engineering",
      description:
        "iOS/Android developer to build native mobile applications for our growing user base....",
    },
    {
      id: 22,
      title: "Brand Manager",
      department: "Marketing",
      description:
        "Brand Manager to oversee brand strategy and maintain consistent messaging across all touchpoints....",
    },
    {
      id: 23,
      title: "Quality Assurance Engineer",
      department: "Engineering",
      description:
        "QA Engineer to ensure product quality through comprehensive testing and automation....",
    },
    {
      id: 24,
      title: "Operations Manager",
      department: "Operations",
      description:
        "Operations Manager to streamline processes and improve operational efficiency across departments....",
    },
    {
      id: 25,
      title: "Legal Counsel",
      department: "Legal",
      description:
        "In-house Legal Counsel to handle contracts, compliance, and corporate legal matters....",
    },
    {
      id: 26,
      title: "Research Scientist",
      department: "R&D",
      description:
        "Research Scientist to lead innovative research projects and explore new technologies....",
    },
  ],
  published: {
    Internal: [
      {
        id: 31,
        title: "Senior Account Executive",
        department: "Sales",
        description:
          "Internal promotion opportunity for Account Executive to manage enterprise client relationships and drive revenue growth...",
        type: "Internal",
      },
      {
        id: 32,
        title: "Lead Software Engineer",
        department: "Engineering",
        description:
          "Internal advancement opportunity for Software Engineer to lead technical initiatives and mentor junior developers...",
        type: "Internal",
      },
      {
        id: 33,
        title: "Marketing Team Lead",
        department: "Marketing",
        description:
          "Internal leadership role for Digital Marketing Manager to lead our online marketing efforts and team expansion...",
        type: "Internal",
      },
      {
        id: 34,
        title: "Senior Product Manager",
        department: "Product",
        description:
          "Internal promotion for Product Manager to define product roadmap and lead cross-functional initiatives...",
        type: "Internal",
      },
      {
        id: 35,
        title: "Principal Data Scientist",
        department: "Analytics",
        description:
          "Internal advancement for Data Scientist to lead analytics strategy and advanced modeling projects...",
        type: "Internal",
      },
      {
        id: 36,
        title: "Design Team Lead",
        department: "Design",
        description:
          "Internal promotion for UX Designer to lead design team and establish design systems across products...",
        type: "Internal",
      },
      {
        id: 37,
        title: "Senior DevOps Engineer",
        department: "Engineering",
        description:
          "Internal advancement for DevOps Engineer to architect cloud infrastructure and lead automation initiatives...",
        type: "Internal",
      },
      {
        id: 38,
        title: "Customer Success Team Lead",
        department: "Customer Success",
        description:
          "Internal promotion to lead customer success team and develop retention strategies...",
        type: "Internal",
      },
      {
        id: 39,
        title: "Senior Business Analyst",
        department: "Operations",
        description:
          "Internal advancement for Business Analyst to lead process optimization and strategic planning...",
        type: "Internal",
      },
      {
        id: 40,
        title: "HR Manager",
        department: "Human Resources",
        description:
          "Internal promotion for HR Business Partner to manage HR operations and talent development programs...",
        type: "Internal",
      },
    ],
    External: [
      {
        id: 41,
        title: "Technical Writer",
        department: "Documentation",
        description:
          "External hire for Technical Writer to create comprehensive documentation and user guides for our products and APIs...",
        type: "External",
      },
      {
        id: 42,
        title: "Site Reliability Engineer",
        department: "Engineering",
        description:
          "External SRE position to ensure system reliability, performance monitoring, and incident response management...",
        type: "External",
      },
      // ...add remaining External jobs as needed...
    ],
  },
  closed: [
    {
      id: 61,
      title: "Marketing Coordinator",
      department: "Marketing",
      description:
        "Entry-level Marketing Coordinator to support marketing campaigns and event coordination.",
      status: "Reopened",
    },
    // ...add remaining closed jobs as needed...
  ],
  archive: [
    {
      id: 71,
      title: "Legacy System Administrator",
      department: "IT",
      description:
        "System Administrator role for maintaining legacy infrastructure (position archived due to system migration).",
    },
    // ...add remaining archive jobs as needed...
  ],
  deleted: [
    {
      id: 81,
      title: "Internship Program Coordinator",
      department: "Human Resources",
      description:
        "Coordinator for managing our annual internship program (deleted due to restructuring).",
    },
    {
      id: 82,
      title: "Customer Support Tier 1",
      department: "Customer Success",
      description:
        "Entry-level customer support role (deleted due to automation of common queries).",
    },
    {
      id: 83,
      title: "Office Administrator",
      department: "Operations",
      description:
        "General office administration and supplies management (deleted, responsibilities merged).",
    },
    {
      id: 84,
      title: "Junior Data Entry Clerk",
      department: "Administration",
      description:
        "Data entry and record keeping (deleted, replaced by automated systems).",
    },
    {
      id: 85,
      title: "Event Planner",
      department: "Marketing",
      description:
        "Planning and execution of company events (deleted due to shift to virtual events).",
    },
  ],
};

export default initialJobData;
