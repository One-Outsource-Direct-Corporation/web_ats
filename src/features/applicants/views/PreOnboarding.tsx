import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Navbar } from "@/shared/components/reusables/Navbar";
import {
  ArrowLeft, Search, Eye, CheckCircle, XCircle, Plus, Trash2, Settings, Loader2,
} from "lucide-react";

interface PreonboardingCandidate {
  id: number;
  candidate_name: string;
  job_title: string;
  signed_offer_uploaded: boolean;
  requirements_submitted: number;
  requirements_required: number;
  requirements_required_submitted: number;
  requirements_total: number;
}

interface TemplateItem {
  key: string;
  label: string;
  required: boolean;
  order: number;
}

interface RequirementItem {
  requirement_key: string;
  requirement_label: string;
  required: boolean;
  status: string;
  version: number;
  original_filename: string;
  file_id: number | null;
  carry_over_to_onboarding: boolean;
  submitted_at: string | null;
}

export default function PreOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateItems, setTemplateItems] = useState<TemplateItem[]>([]);
  const [newTemplateItem, setNewTemplateItem] = useState("");

  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [candidateItems, setCandidateItems] = useState<TemplateItem[]>([]);
  const [newCandidateItem, setNewCandidateItem] = useState("");

  const currentJobId = location.state?.jobId;

  // Fetch pipeline step id for pre_onboarding
  const { data: pipelineStepId } = useQuery({
    queryKey: ["preonboarding-pipeline-step", currentJobId],
    queryFn: async () => {
      if (!currentJobId) return null;
      const res = await axiosPrivate.get(`/api/jobs/${currentJobId}/`);
      const job = res.data;
      const pipelineId = job.pipeline_container?.id;
      if (!pipelineId) return null;
      const stepsRes = await axiosPrivate.get(`/api/pipeline/steps/?pipeline_id=${pipelineId}`);
      const steps = stepsRes.data as Array<{ id: number; process_type: string }>;
      const preStep = steps.find((s: { process_type: string }) => s.process_type === "pre_onboarding");
      return preStep?.id ?? null;
    },
    enabled: !!currentJobId,
  });

  // Fetch global template
  const { data: templateData } = useQuery({
    queryKey: ["preonboarding-template", pipelineStepId],
    queryFn: async () => {
      if (!pipelineStepId) return { requirements: [] };
      const res = await axiosPrivate.get(`/api/candidate/preonboarding/pipeline-steps/${pipelineStepId}/template/`);
      return res.data as { requirements: TemplateItem[] };
    },
    enabled: !!pipelineStepId,
  });

  // Fetch candidates at preonboarding
  const { data: candidates = [], isLoading: candidatesLoading } = useQuery({
    queryKey: ["preonboarding-candidates", currentJobId],
    queryFn: async () => {
      if (!currentJobId) return [];
      const res = await axiosPrivate.get(`/api/candidate/preonboarding/candidates/?job_posting_id=${currentJobId}`);
      return res.data as PreonboardingCandidate[];
    },
    enabled: !!currentJobId,
  });

  // Save template mutation
  const saveTemplateMutation = useMutation({
    mutationFn: async (items: TemplateItem[]) => {
      await axiosPrivate.put(`/api/candidate/preonboarding/pipeline-steps/${pipelineStepId}/template/`, {
        requirements: items,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preonboarding-template", pipelineStepId] });
      setShowTemplateModal(false);
    },
  });

  // Load template into candidate
  const loadTemplateMutation = useMutation({
    mutationFn: async (candidateAppId: number) => {
      const res = await axiosPrivate.post(`/api/candidate/preonboarding/candidates/${candidateAppId}/load-template/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preonboarding-candidates", currentJobId] });
      queryClient.invalidateQueries({ queryKey: ["preonboarding-candidate-reqs", selectedCandidateId] });
    },
  });

  // Save candidate requirements
  const saveCandidateReqsMutation = useMutation({
    mutationFn: async ({ appId, items }: { appId: number; items: TemplateItem[] }) => {
      await axiosPrivate.put(`/api/candidate/preonboarding/candidates/${appId}/requirements/`, {
        requirements: items,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preonboarding-candidates", currentJobId] });
      setShowCandidateModal(false);
    },
  });

  // Pass/Fail
  const passFailMutation = useMutation({
    mutationFn: async ({ candidateAppId, stepId, outcome }: { candidateAppId: number; stepId: number; outcome: string }) => {
      await axiosPrivate.post("/api/candidate/pipeline/progress/", {
        candidate_application_id: candidateAppId,
        pipeline_step_id: stepId,
        outcome,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preonboarding-candidates", currentJobId] });
    },
  });

  const handleStageChange = (value: string) => {
    const customFinalStages = [
      "OfferAndFinalization",
      "PreOnboarding",
      "Onboarding",
      "Failed",
    ];
    const isCustomFinalStage = customFinalStages.includes(value);
    const currentJobId = location.state?.jobId;
    const path = isCustomFinalStage
      ? `/job/stage/${value}`
      : `/job/${currentJobId}/${value}`;
    navigate(path, {
      state: {
        jobTitle: location.state?.jobTitle,
        jobId: currentJobId,
        from: location.pathname,
      },
    });
  };

  const openTemplateModal = () => {
    setTemplateItems(templateData?.requirements?.length
      ? templateData.requirements.map((r, i) => ({ ...r, order: r.order ?? i }))
      : []
    );
    setShowTemplateModal(true);
  };

  const addTemplateItem = () => {
    if (!newTemplateItem.trim()) return;
    const key = `req-${Date.now()}`;
    setTemplateItems([...templateItems, { key, label: newTemplateItem.trim(), required: true, order: templateItems.length }]);
    setNewTemplateItem("");
  };

  const removeTemplateItem = (key: string) => {
    setTemplateItems(templateItems.filter((t) => t.key !== key));
  };

  const toggleTemplateRequired = (key: string) => {
    setTemplateItems(templateItems.map((t) => t.key === key ? { ...t, required: !t.required } : t));
  };

  const openCandidateModal = async (candidate: PreonboardingCandidate) => {
    setSelectedCandidateId(candidate.id);
    try {
      const res = await axiosPrivate.get(`/api/candidate/me/preonboarding/`, {
        params: { candidate_application_id: candidate.id },
      });
      const data = res.data;
      const items: TemplateItem[] = (data.requirements || []).map((r: RequirementItem, i: number) => ({
        key: r.requirement_key,
        label: r.requirement_label,
        required: r.required,
        order: i,
      }));
      setCandidateItems(items.length ? items : []);
    } catch {
      setCandidateItems([]);
    }
    setShowCandidateModal(true);
  };

  const addCandidateItem = () => {
    if (!newCandidateItem.trim()) return;
    const key = `req-${Date.now()}`;
    setCandidateItems([...candidateItems, { key, label: newCandidateItem.trim(), required: true, order: candidateItems.length }]);
    setNewCandidateItem("");
  };

  const removeCandidateItem = (key: string) => {
    setCandidateItems(candidateItems.filter((t) => t.key !== key));
  };

  const toggleCandidateRequired = (key: string) => {
    setCandidateItems(candidateItems.map((t) => t.key === key ? { ...t, required: !t.required } : t));
  };

  const filteredCandidates = candidates.filter((a) =>
    a.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canPass = (candidate: PreonboardingCandidate) => {
    return candidate.signed_offer_uploaded && candidate.requirements_required_submitted === candidate.requirements_required;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 mt-20">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate(location.state?.from || "/job")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Select defaultValue="PreOnboarding" onValueChange={handleStageChange}>
              <SelectTrigger className="w-64">
                <SelectValue>
                  <span className="font-bold">Pre-Onboarding</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OfferAndFinalization">
                  <span className="font-bold">For Offer And Finalization</span>
                </SelectItem>
                <SelectItem value="PreOnboarding">
                  <span className="font-bold">Pre-Onboarding</span>
                </SelectItem>
                <SelectItem value="Onboarding">
                  <span className="font-bold">Onboarding</span>
                </SelectItem>
                <SelectItem value="Failed">
                  <span className="font-bold">Failed</span>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="ml-auto flex items-center gap-2"
              onClick={openTemplateModal}
              disabled={!pipelineStepId}
            >
              <Settings className="h-4 w-4" />
              Configure Global Template
            </Button>
          </div>

          {/* Applicant Review Table */}
          <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
            <div className="p-4 border-b flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-center">ID</TableHead>
                  <TableHead className="w-48">Full Name</TableHead>
                  <TableHead className="w-48">Position</TableHead>
                  <TableHead className="w-40 text-center">Signed Offer</TableHead>
                  <TableHead className="w-40 text-center">Documents</TableHead>
                  <TableHead className="w-56 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidatesLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No applicants found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell className="text-center">{applicant.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/32?u=${applicant.id}`} />
                            <AvatarFallback>
                              {applicant.candidate_name?.split(" ").map((n) => n[0]).join("") || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{applicant.candidate_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{applicant.job_title}</TableCell>
                      <TableCell className="text-center">
                        {applicant.signed_offer_uploaded ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-700">Uploaded</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Not uploaded</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm">
                          {applicant.requirements_required_submitted}/{applicant.requirements_required}
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1 max-w-[80px] mx-auto">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${applicant.requirements_required > 0 ? (applicant.requirements_required_submitted / applicant.requirements_required) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => openCandidateModal(applicant)}
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Config
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={!canPass(applicant)}
                            onClick={() => {
                              if (pipelineStepId) {
                                passFailMutation.mutate({
                                  candidateAppId: applicant.id,
                                  stepId: pipelineStepId,
                                  outcome: "pass",
                                });
                              }
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Pass
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => {
                              if (pipelineStepId) {
                                passFailMutation.mutate({
                                  candidateAppId: applicant.id,
                                  stepId: pipelineStepId,
                                  outcome: "fail",
                                });
                              }
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Fail
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Global Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTemplateModal(false)} />
          <div className="relative z-10 w-full max-w-2xl mx-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Global Preonboarding Requirements Template
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                This template will be used as default for all candidates reaching preonboarding for this job.
                You can customize per-candidate after loading the template.
              </p>

              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto border rounded-lg p-3">
                {templateItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.required}
                        onChange={() => toggleTemplateRequired(item.key)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{item.label}</span>
                      {item.required && <span className="text-xs text-red-500">required</span>}
                    </div>
                    <button onClick={() => removeTemplateItem(item.key)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add requirement"
                  value={newTemplateItem}
                  onChange={(e) => setNewTemplateItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTemplateItem()}
                />
                <Button variant="outline" onClick={addTemplateItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#0056d2] hover:bg-blue-700 text-white"
                  onClick={() => saveTemplateMutation.mutate(templateItems)}
                >
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Per-Candidate Config Modal */}
      {showCandidateModal && selectedCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCandidateModal(false)} />
          <div className="relative z-10 w-full max-w-2xl mx-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Requirements for Candidate #{selectedCandidateId}
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadTemplateMutation.mutate(selectedCandidateId)}
                  className="text-xs"
                >
                  Load from Template
                </Button>
              </div>

              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto border rounded-lg p-3">
                {candidateItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.required}
                        onChange={() => toggleCandidateRequired(item.key)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{item.label}</span>
                      {item.required && <span className="text-xs text-red-500">required</span>}
                    </div>
                    <button
                      onClick={() => removeCandidateItem(item.key)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add custom requirement"
                  value={newCandidateItem}
                  onChange={(e) => setNewCandidateItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCandidateItem()}
                />
                <Button variant="outline" onClick={addCandidateItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCandidateModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#0056d2] hover:bg-blue-700 text-white"
                  onClick={() => {
                    if (selectedCandidateId) {
                      saveCandidateReqsMutation.mutate({
                        appId: selectedCandidateId,
                        items: candidateItems,
                      });
                    }
                  }}
                >
                  Save Requirements
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
