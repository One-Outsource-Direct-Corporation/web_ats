import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { toast } from "react-toastify";
import { Search, UserPlus } from "lucide-react";
import AssignToJobModal from "@/features/talent-pool/components/AssignToJobModal";

interface PooledCandidate {
  id: number;
  candidate_name: string;
  candidate_email: string;
  candidate_photo_url: string | null;
  candidate_skills: string[];
  original_job_title: string;
  rejection_reason: string;
  pooled_by: string;
  pooled_at: string;
  notes: string;
}

export default function PoolApplicants() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<PooledCandidate | null>(null);
  const pageSize = 20;

  useEffect(() => {
    document.title = "Pool Applicants";
  }, []);

  const { data: poolData, isLoading } = useQuery({
    queryKey: ["talent-pool", currentPage],
    queryFn: async () => {
      const response = await axiosPrivate.get("/api/candidate/talent-pool/", {
        params: { page: currentPage, page_size: pageSize },
      });
      return response.data;
    },
  });

  const filteredCandidates =
    poolData?.results?.filter(
      (candidate: PooledCandidate) =>
        candidate.candidate_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        candidate.candidate_email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    ) || [];

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleGoBack = () => {
    setShowCancelModal(false);
    window.history.back();
  };

  const handleCloseModal = () => {
    setShowCancelModal(false);
  };

  const handleAssignToJob = (candidate: PooledCandidate) => {
    setSelectedCandidate(candidate);
    setAssignModalOpen(true);
  };

  const handleAssignSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["talent-pool"] });
    toast.success("Candidate assigned to job posting");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 mt-20 flex items-center justify-center">
        <div className="text-gray-500">Loading pooled applicants...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 mt-20">
        <div className="mx-auto max-w-none space-y-4">
          {/* Header with Cancel Button */}
          <div className="flex justify-between items-start">
            <h2 className="text-4xl font-bold text-gray-800 border-l-4 border-blue-500 pl-4">
              Pooling of all Applicants
            </h2>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>

          {/* Search */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-64">
              <Input
                placeholder="Search Applicant Name"
                className="pl-10 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Applicant Cards */}
          <div className="space-y-4 pb-20">
            {filteredCandidates.map((candidate: PooledCandidate) => (
              <div
                key={candidate.id}
                className="flex items-start justify-between bg-white p-4 rounded-lg shadow-sm border"
              >
                {/* Left side */}
                <div className="flex items-start gap-4">
                  <img
                    src={candidate.candidate_photo_url || "/placeholder-avatar.png"}
                    alt={candidate.candidate_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-md font-semibold">
                      {candidate.candidate_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {candidate.candidate_email}
                    </p>
                    <p className="text-sm text-gray-500">
                      Position Applied:{" "}
                      <span className="text-gray-700">
                        {candidate.original_job_title}
                      </span>
                    </p>
                    {candidate.rejection_reason && (
                      <p className="text-sm text-gray-500">
                        Rejection Reason:{" "}
                        <span className="text-gray-700">
                          {candidate.rejection_reason}
                        </span>
                      </p>
                    )}
                    {candidate.candidate_skills &&
                      candidate.candidate_skills.length > 0 && (
                        <p className="text-sm text-gray-500">
                          Matched Skills:{" "}
                          <span className="text-gray-700">
                            {candidate.candidate_skills.join(", ")}
                          </span>
                        </p>
                      )}
                    {candidate.pooled_by && (
                      <p className="text-xs text-gray-400 mt-1">
                        Pooled by {candidate.pooled_by}
                        {candidate.pooled_at
                          ? ` on ${new Date(candidate.pooled_at).toLocaleDateString()}`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
                {/* Right side */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(
                          `/job/list/applicants/${candidate.id}`,
                        )
                      }
                    >
                      View Profile
                    </Button>
                    <Button
                      className="bg-[#0056D2]"
                      size="sm"
                      onClick={() => handleAssignToJob(candidate)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Assign to Job
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {poolData && poolData.count > pageSize && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="px-4 py-2">
                Page {currentPage} of{" "}
                {Math.ceil(poolData.count / pageSize)}
              </span>
              <Button
                variant="outline"
                disabled={
                  currentPage >= Math.ceil(poolData.count / pageSize)
                }
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}

          {filteredCandidates.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm
                  ? "No applicants match your search"
                  : "No applicants in the talent pool"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assign to Job Modal */}
      {selectedCandidate && (
        <AssignToJobModal
          open={assignModalOpen}
          onOpenChange={setAssignModalOpen}
          candidate={{
            id: selectedCandidate.id,
            candidate_name: selectedCandidate.candidate_name,
            candidate_email: selectedCandidate.candidate_email,
          }}
          onSuccess={handleAssignSuccess}
        />
      )}

      {/* Cancel Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel pooling of applicants?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Clicking "Cancel" will return you to the previous screen. No
            changes will be applied to the pooling.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="text-gray-600 hover:text-gray-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGoBack}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
