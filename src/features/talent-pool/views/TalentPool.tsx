import { useState } from "react";
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
import { Search, Trash2, UserPlus } from "lucide-react";
import AssignToJobModal from "../components/AssignToJobModal";

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

export default function TalentPool() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<PooledCandidate | null>(null);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [candidateToRemove, setCandidateToRemove] = useState<{id: number, name: string} | null>(null);
  const pageSize = 20;

  const { data: poolData, isLoading } = useQuery({
    queryKey: ['talent-pool', currentPage],
    queryFn: async () => {
      const response = await axiosPrivate.get('/api/candidate/talent-pool/', {
        params: { page: currentPage, page_size: pageSize }
      });
      return response.data;
    },
  });

  const removeFromPoolMutation = useMutation({
    mutationFn: async (poolId: number) => {
      await axiosPrivate.post(`/api/candidate/talent-pool/${poolId}/remove_from_pool/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talent-pool'] });
      toast.success('Candidate removed from talent pool');
      setRemoveConfirmOpen(false);
      setCandidateToRemove(null);
    },
    onError: () => {
      toast.error('Failed to remove candidate from pool');
    },
  });

  const filteredCandidates = poolData?.results?.filter((candidate: PooledCandidate) =>
    candidate.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.candidate_email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAssignToJob = (candidate: PooledCandidate) => {
    setSelectedCandidate(candidate);
    setAssignModalOpen(true);
  };

  const handleRemoveFromPool = (poolId: number, candidateName: string) => {
    setCandidateToRemove({ id: poolId, name: candidateName });
    setRemoveConfirmOpen(true);
  };

  const confirmRemove = () => {
    if (candidateToRemove) {
      removeFromPoolMutation.mutate(candidateToRemove.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading talent pool...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4">
            Talent Pool
          </h1>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search by name or email"
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredCandidates.map((candidate: PooledCandidate) => (
            <div
              key={candidate.id}
              className="flex items-start justify-between bg-white p-4 rounded-lg shadow-sm border"
            >
              <div className="flex items-start gap-4">
                <img
                  src={candidate.candidate_photo_url || "/placeholder-avatar.png"}
                  alt={candidate.candidate_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-md font-semibold">{candidate.candidate_name}</h3>
                  <p className="text-sm text-gray-500">{candidate.candidate_email}</p>
                  <p className="text-sm text-gray-500">
                    Last Position: <span className="text-gray-700">{candidate.original_job_title}</span>
                  </p>
                  {candidate.rejection_reason && (
                    <p className="text-sm text-gray-500">
                      Rejection Reason: <span className="text-gray-700">{candidate.rejection_reason}</span>
                    </p>
                  )}
                  {candidate.candidate_skills && candidate.candidate_skills.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Skills: <span className="text-gray-700">{candidate.candidate_skills.join(", ")}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Pooled by {candidate.pooled_by} on {new Date(candidate.pooled_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignToJob(candidate)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Assign to Job
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveFromPool(candidate.id, candidate.candidate_name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {poolData && poolData.count > pageSize && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </Button>
            <span className="px-4 py-2">
              Page {currentPage} of {Math.ceil(poolData.count / pageSize)}
            </span>
            <Button
              variant="outline"
              disabled={currentPage >= Math.ceil(poolData.count / pageSize)}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        )}

        {filteredCandidates.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No candidates in talent pool</p>
          </div>
        )}
      </div>

      {selectedCandidate && (
        <AssignToJobModal
          open={assignModalOpen}
          onOpenChange={setAssignModalOpen}
          candidate={selectedCandidate}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['talent-pool'] });
            toast.success('Candidate assigned to job posting');
          }}
        />
      )}

      <Dialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove from Talent Pool</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to remove {candidateToRemove?.name} from the talent pool? This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRemoveConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmRemove}
              className="bg-red-600 hover:bg-red-700"
              disabled={removeFromPoolMutation.isPending}
            >
              {removeFromPoolMutation.isPending ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
