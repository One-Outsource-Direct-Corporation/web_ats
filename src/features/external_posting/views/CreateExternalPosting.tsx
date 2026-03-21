import { useEffect } from "react";
import ExternalPostingForm from "./ExternalPostingForm";

export default function CreateExternalPosting() {
  useEffect(() => {
    document.title = "Create External Posting";
  }, []);

  return <ExternalPostingForm />;
}
