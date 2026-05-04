import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosPrivate } from "@/config/axios";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface Application {
  id: number;
  job_posting: number;
  status: string;
  email: string;
  source: string;
  submitted_at: string;
}

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosPrivate
      .get("/api/candidate/me/applications/")
      .then((res) => setApplications(res.data.results || res.data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        Welcome, {user?.first_name} {user?.last_name}
      </h1>
      <p className="text-gray-600 mb-6">{user?.email}</p>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">My Applications</h2>
        <a
          href="/careers"
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Browse Jobs
        </a>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <div className="bg-gray-50 border rounded p-8 text-center text-gray-500">
          You haven't applied to any jobs yet.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Source</th>
                <th className="px-4 py-2 text-left">Submitted</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{app.id}</td>
                  <td className="px-4 py-2 capitalize">{app.status.replace(/_/g, " ")}</td>
                  <td className="px-4 py-2 capitalize">{app.source.replace(/_/g, " ")}</td>
                  <td className="px-4 py-2">
                    {new Date(app.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/candidate/applications/${app.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
