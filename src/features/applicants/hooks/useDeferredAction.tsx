import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/shared/components/ui/button";

const GRACE_PERIOD_MS = 5000;
const DEFERRED_ACTION_TOAST_POSITION = "top-center" as const;

interface PendingAction {
  id: string;
  candidateName: string;
  label: string;
  toastId?: string | number;
  dedupKey?: string;
  candidateId?: number;
}

export interface QueueActionParams {
  candidateName: string;
  label: string;
  onCommit: () => Promise<void>;
  dedupKey?: string;
  candidateId?: number;
}

export function useDeferredAction() {
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const pendingActionsRef = useRef<PendingAction[]>([]);
  const pendingTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const pendingCountdownIntervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const commitCallbacksRef = useRef<Record<string, () => Promise<void>>>({});
  const dedupKeysRef = useRef<Set<string>>(new Set());
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    pendingActionsRef.current = pendingActions;
  }, [pendingActions]);

  useEffect(() => {
    return () => {
      for (const timerId of Object.values(pendingTimersRef.current)) {
        window.clearTimeout(timerId);
      }
      pendingTimersRef.current = {};

      for (const intervalId of Object.values(pendingCountdownIntervalsRef.current)) {
        window.clearInterval(intervalId);
      }
      pendingCountdownIntervalsRef.current = {};
    };
  }, []);

  const pendingCandidateIds = useMemo(
    () => new Set(pendingActions.filter((a) => a.candidateId).map((a) => a.candidateId as number)),
    [pendingActions],
  );

  const clearPendingActionCountdown = useCallback((actionId: string) => {
    const intervalId = pendingCountdownIntervalsRef.current[actionId];
    if (!intervalId) return;
    window.clearInterval(intervalId);
    delete pendingCountdownIntervalsRef.current[actionId];
  }, []);

  const removePendingAction = useCallback((actionId: string) => {
    setPendingActions((prev) => prev.filter((a) => a.id !== actionId));
  }, []);

  const handleUndo = useCallback((actionId: string) => {
    const timerId = pendingTimersRef.current[actionId];
    if (timerId) {
      window.clearTimeout(timerId);
      delete pendingTimersRef.current[actionId];
    }

    clearPendingActionCountdown(actionId);

    const existingAction = pendingActionsRef.current.find((a) => a.id === actionId);
    removePendingAction(actionId);

    if (existingAction) {
      if (existingAction.dedupKey) dedupKeysRef.current.delete(existingAction.dedupKey);
      if (existingAction.toastId !== undefined) {
        toast.dismiss(existingAction.toastId);
      }
    }
  }, [clearPendingActionCountdown, removePendingAction]);

  const commitAction = useCallback(async (pendingAction: PendingAction) => {
    if (!pendingActionsRef.current.some((a) => a.id === pendingAction.id)) return;

    const timerId = pendingTimersRef.current[pendingAction.id];
    if (timerId) {
      window.clearTimeout(timerId);
      delete pendingTimersRef.current[pendingAction.id];
    }

    clearPendingActionCountdown(pendingAction.id);

    if (pendingAction.toastId !== undefined) {
      try { toast.dismiss(pendingAction.toastId); } catch { /* ignore */ }
    }

    const callback = commitCallbacksRef.current[pendingAction.id];
    if (!callback) {
      removePendingAction(pendingAction.id);
      return;
    }

    setProcessingId(pendingAction.id);

    try {
      await callback();
    } finally {
      if (pendingAction.dedupKey) dedupKeysRef.current.delete(pendingAction.dedupKey);
      delete commitCallbacksRef.current[pendingAction.id];
      removePendingAction(pendingAction.id);
      setProcessingId(null);
    }
  }, [clearPendingActionCountdown, removePendingAction]);

  const queueAction = useCallback((params: QueueActionParams): string | null => {
    if (params.dedupKey) {
      if (dedupKeysRef.current.has(params.dedupKey)) return null;
      dedupKeysRef.current.add(params.dedupKey);
    }

    const actionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    commitCallbacksRef.current[actionId] = params.onCommit;

    const pendingAction: PendingAction = {
      id: actionId,
      candidateName: params.candidateName,
      label: params.label,
      dedupKey: params.dedupKey,
      candidateId: params.candidateId,
    };

    const startingSeconds = Math.ceil(GRACE_PERIOD_MS / 1000);
    let secondsLeft = startingSeconds;

    const renderToast = (pa: PendingAction, secs: number) => (
      <div className="space-y-2">
        <p className="text-sm leading-5">
          <span className="font-semibold">{pa.candidateName}</span>{" "}
          queued for {pa.label}. Auto-submit in {secs} second{secs === 1 ? "" : "s"}.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() => handleUndo(pa.id)}
        >
          Undo
        </Button>
      </div>
    );

    const toastId = toast.info(renderToast(pendingAction, startingSeconds), {
      autoClose: false,
      closeButton: false,
      position: DEFERRED_ACTION_TOAST_POSITION,
    });

    pendingAction.toastId = toastId;
    setPendingActions((prev) => [...prev, pendingAction]);

    pendingCountdownIntervalsRef.current[actionId] = window.setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        clearPendingActionCountdown(actionId);
        try { toast.dismiss(toastId); } catch { /* ignore */ }
        return;
      }
      toast.update(toastId, { render: renderToast(pendingAction, secondsLeft) });
    }, 1000);

    pendingTimersRef.current[actionId] = window.setTimeout(() => {
      void commitAction(pendingAction);
    }, GRACE_PERIOD_MS);

    return actionId;
  }, [clearPendingActionCountdown, commitAction, handleUndo]);

  return { queueAction, processingId, pendingCandidateIds };
}
