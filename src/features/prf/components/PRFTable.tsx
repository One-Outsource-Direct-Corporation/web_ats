import React from "react";
import type { FormData } from "../types/prf.types";

interface PRFTableProps {
  data: FormData[];
}

export const PRFTable: React.FC<PRFTableProps> = ({ data }) => (
  <table className="min-w-full border">
    <thead>
      <tr>
        <th className="px-2 py-1 border">Job Title</th>
        <th className="px-2 py-1 border">Vacancies</th>
        <th className="px-2 py-1 border">Start Date</th>
        {/* ...other columns... */}
      </tr>
    </thead>
    <tbody>
      {data.map((row, idx) => (
        <tr key={idx}>
          <td className="px-2 py-1 border">{row.jobTitle}</td>
          <td className="px-2 py-1 border">{row.numberOfVacancies}</td>
          <td className="px-2 py-1 border">{row.targetStartDate}</td>
          {/* ...other cells... */}
        </tr>
      ))}
    </tbody>
  </table>
);
