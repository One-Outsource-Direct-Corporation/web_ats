interface PRFRenderStepProps {
  step: number;
}

export default function PRFRenderStep({ step }: PRFRenderStepProps) {
  let content;

  switch (step) {
    case 1:
      content = <div>Step 1: Position Details</div>;
      break;
    case 2:
      content = <div>Step 2: Job Description</div>;
      break;
    case 3:
      content = <div>Step 3: Required Skills</div>;
      break;
    case 4:
      content = <div>Step 4: Interview Panel</div>;
      break;
    case 5:
      content = <div>Step 5: Approval Workflow</div>;
      break;
    case 6:
      content = <div>Step 6: Review & Submit</div>;
      break;
    default:
      content = <div>Invalid Step</div>;
  }

  return content;
}
