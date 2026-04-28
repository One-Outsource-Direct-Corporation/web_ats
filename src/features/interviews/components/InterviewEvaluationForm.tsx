import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Mic, Upload, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { defaultAxios } from "@/config/axios";
import { toast } from "react-toastify";

type PipelineProgressOutcome = "pass" | "fail";

const GRACE_PERIOD_MS = 5000;

interface PendingProgressAction {
  id: string;
  candidateApplicationId: number;
  candidateName: string;
  pipelineStepId: number;
  outcome: PipelineProgressOutcome;
}

interface InterviewRouteState {
  candidateApplicationId?: number;
  candidateName?: string;
  pipelineStepId?: number;
  processType?: string;
  scheduledFor?: string;
  interviewerName?: string;
  interviewerEmail?: string;
  department?: string;
  jobTitle?: string;
}

const toDateInputValue = (isoDateTime?: string): string => {
  if (!isoDateTime) {
    return "";
  }

  const parsed = new Date(isoDateTime);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function InterviewEvaluationForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = (location.state as InterviewRouteState | null) ?? null;

  const [formData, setFormData] = useState(() => ({
    applicantName: routeState?.candidateName ?? "",
    interviewDate: toDateInputValue(routeState?.scheduledFor),
    positionApplyingFor: routeState?.jobTitle ?? "",
    interviewer: routeState?.interviewerName ?? routeState?.interviewerEmail ?? "",
    notes: "",
  }));

  const [pendingActions, setPendingActions] = useState<PendingProgressAction[]>([]);
  const [isCommittingAction, setIsCommittingAction] = useState(false);
  const pendingTimersRef = useRef<Record<string, ReturnType<typeof window.setTimeout>>>({});
  const pendingActionsRef = useRef<PendingProgressAction[]>([]);

  useEffect(() => {
    pendingActionsRef.current = pendingActions;
  }, [pendingActions]);

  useEffect(() => {
    return () => {
      for (const timerId of Object.values(pendingTimersRef.current)) {
        window.clearTimeout(timerId);
      }
      pendingTimersRef.current = {};
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    toast.success("Interview evaluation form submitted.");
  };

  const removePendingAction = (actionId: string) => {
    setPendingActions((previousValue) =>
      previousValue.filter((action) => action.id !== actionId),
    );
  };

  const handleUndoPendingAction = (actionId: string) => {
    const timerId = pendingTimersRef.current[actionId];
    if (timerId) {
      window.clearTimeout(timerId);
      delete pendingTimersRef.current[actionId];
    }

    removePendingAction(actionId);
    toast.dismiss(actionId);
  };

  const commitPendingAction = async (pendingAction: PendingProgressAction) => {
    if (!pendingActionsRef.current.some((action) => action.id === pendingAction.id)) {
      return;
    }

    const timerId = pendingTimersRef.current[pendingAction.id];
    if (timerId) {
      window.clearTimeout(timerId);
      delete pendingTimersRef.current[pendingAction.id];
    }

    setIsCommittingAction(true);

    try {
      await defaultAxios.post("/api/candidate/pipeline/progress/", {
        candidate_application_id: pendingAction.candidateApplicationId,
        pipeline_step_id: pendingAction.pipelineStepId,
        outcome: pendingAction.outcome,
        remarks: formData.notes,
      });

      toast.success(
        `${pendingAction.candidateName} marked as ${
          pendingAction.outcome === "pass" ? "Pass" : "Fail"
        }.`,
      );
    } catch (error) {
      console.error("Unable to update candidate pipeline progress.", error);
      toast.error("Unable to submit interview outcome.");
    } finally {
      removePendingAction(pendingAction.id);
      setIsCommittingAction(false);
    }
  };

  const queueInterviewOutcome = (outcome: PipelineProgressOutcome) => {
    const candidateApplicationId = routeState?.candidateApplicationId;
    const pipelineStepId = routeState?.pipelineStepId;

    if (!candidateApplicationId || !pipelineStepId) {
      toast.error("Interview context is missing candidate or pipeline step details.");
      return;
    }

    if (isCommittingAction) {
      return;
    }

    const hasPendingAction = pendingActions.some(
      (pendingAction) =>
        pendingAction.candidateApplicationId === candidateApplicationId &&
        pendingAction.pipelineStepId === pipelineStepId,
    );
    if (hasPendingAction) {
      return;
    }

    const pendingAction: PendingProgressAction = {
      id: `${candidateApplicationId}-${pipelineStepId}-${Date.now()}-${outcome}`,
      candidateApplicationId,
      candidateName: routeState?.candidateName || formData.applicantName || "Candidate",
      pipelineStepId,
      outcome,
    };

    toast.info(
      <div className="space-y-2">
        <p className="text-sm leading-5">
          <span className="font-semibold">{pendingAction.candidateName}</span>{" "}
          queued for {outcome === "pass" ? "Pass" : "Fail"}. Auto-submit in 5 seconds.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() => handleUndoPendingAction(pendingAction.id)}
        >
          Undo
        </Button>
      </div>,
      {
        toastId: pendingAction.id,
        autoClose: GRACE_PERIOD_MS,
        closeButton: false,
        position: "top-right",
      },
    );

    setPendingActions((previousValue) => [...previousValue, pendingAction]);
    pendingTimersRef.current[pendingAction.id] = window.setTimeout(() => {
      void commitPendingAction(pendingAction);
    }, GRACE_PERIOD_MS);
  };

  const handlePass = () => {
    queueInterviewOutcome("pass");
  };

  const handleFail = () => {
    queueInterviewOutcome("fail");
  };

  const handleLiveRecord = () => {
    console.log("Starting live recording");
    // Handle live recording logic here
  };

  const handleUploadFile = () => {
    console.log("Opening file upload");
    // Handle file upload logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          {/* Back + Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-center sm:text-left w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="self-center sm:self-auto text-blue-600 hover:bg-blue-50 px-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="w-full">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Interview Evaluation Form
              </h1>
              <div className="w-full h-1 bg-blue-500 rounded"></div>
            </div>
          </div>

          {/* Pass/Fail Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center">
            <Button
              onClick={handlePass}
              variant="outline"
              disabled={isCommittingAction}
              className="border-green-500 text-green-600 hover:bg-green-50 px-6 w-full sm:w-auto"
            >
              Pass
            </Button>
            <Button
              onClick={handleFail}
              variant="outline"
              disabled={isCommittingAction}
              className="border-red-500 text-red-600 hover:bg-red-50 px-6 w-full sm:w-auto"
            >
              Fail
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-8">
            {/* First Row - Applicant Name and Interview Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label
                  htmlFor="applicantName"
                  className="text-sm font-medium text-gray-700"
                >
                  Applicant Name
                </Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName}
                  onChange={(e) =>
                    handleInputChange("applicantName", e.target.value)
                  }
                  placeholder="Enter applicant name"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="interviewDate"
                  className="text-sm font-medium text-gray-700"
                >
                  Interview Date
                </Label>
                <Input
                  id="interviewDate"
                  type="date"
                  value={formData.interviewDate}
                  onChange={(e) =>
                    handleInputChange("interviewDate", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Second Row - Position and Interviewer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <Label
                  htmlFor="positionApplyingFor"
                  className="text-sm font-medium text-gray-700"
                >
                  Position Applying for
                </Label>
                <Input
                  id="positionApplyingFor"
                  value={formData.positionApplyingFor}
                  readOnly
                  placeholder="Job posting title"
                  className="w-full bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="interviewer"
                  className="text-sm font-medium text-gray-700"
                >
                  Interviewer
                </Label>
                <Input
                  id="interviewer"
                  value={formData.interviewer}
                  readOnly
                  placeholder="Selected pipeline step interviewer"
                  className="w-full bg-gray-50"
                />
              </div>
            </div>

            {/* Record or Upload File Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Record or Upload File
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our AI will analyze the interview, summarize key points, and
                help you assess the applicant—saving your time and effort.
              </p>

              {/* Center the buttons only */}
              <div className="flex justify-center">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleLiveRecord}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    Live Record
                  </Button>
                  <Button
                    onClick={handleUploadFile}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              </div>
            </div>

            {/* Add Notes Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Add Notes
              </h2>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Add your interview notes here..."
                className="w-full min-h-30 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
