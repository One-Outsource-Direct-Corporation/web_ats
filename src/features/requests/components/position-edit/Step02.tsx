import { RichTextEditor } from "@/shared/components/reusables/RichTextEditor";
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { useState } from "react";

export default function Step02() {
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");
  return (
    <FieldGroup className="mt-10">
      <Field>
        <FieldLabel>Description</FieldLabel>
        <RichTextEditor value={description} onChange={setDescription} />
      </Field>
      <Field>
        <FieldLabel>Responsibilities</FieldLabel>
        <RichTextEditor
          value={responsibilities}
          onChange={setResponsibilities}
        />
      </Field>
      <Field>
        <FieldLabel>Qualifications</FieldLabel>
        <RichTextEditor value={qualifications} onChange={setQualifications} />
      </Field>
    </FieldGroup>
  );
}
