import { Badge } from "@/shared/components/ui/badge"

interface QuestionnaireItem {
  id: number;
  question: string;
  question_type: string;
  options?: Array<{ value: string; score?: number } | string>;
}

interface QuestionnaireSection {
  id?: number;
  name: string;
  questionnaires: QuestionnaireItem[];
}

interface AnsweredFormProps {
  snapshot: Record<string, unknown>;
  questionnaireSnapshot: Record<string, unknown>;
  questionnaireSections?: QuestionnaireSection[];
}

const fieldLabels: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  birthday: "Birth Date",
  birth_date: "Birth Date",
  gender: "Gender",
  primaryContact: "Primary Contact Number",
  primary_contact_number: "Primary Contact Number",
  secondaryContact: "Secondary Contact Number",
  secondary_contact_number: "Secondary Contact Number",
  email: "Email",
  linkedinProfile: "LinkedIn Profile",
  linkedin_profile: "LinkedIn Profile",
  addressLine1: "Address Line 1",
  address: "Address",
  city: "City / District",
  district: "District",
  postalCode: "Postal Code",
  postal_code: "Postal Code",
  country: "Country",
  expectedSalary: "Expected Salary",
  expected_salary: "Expected Salary",
  willingToWorkOnsite: "Willing to Work Onsite",
  willing_to_work_onsite: "Willing to Work Onsite",
  interviewSchedule: "Preferred Interview Schedule",
  preferred_interview_schedule: "Preferred Interview Schedule",
  highestEducation: "Highest Education",
  highest_education: "Highest Education",
  yearGraduated: "Year Graduated",
  year_graduated: "Year Graduated",
  institution: "Institution / University",
  university: "Institution / University",
  program: "Program / Course",
  course: "Program / Course",
  workExperience: "Work Experience",
  work_experience: "Work Experience",
  jobTitle: "Job Title",
  job_title: "Job Title",
  company: "Company",
  years: "Years of Experience",
  howDidYouLearn: "How Did You Hear About Us",
  how_did_you_hear_about_us: "How Did You Hear About Us",
  certificationAccepted: "Data Privacy Agreement Accepted",
  agreement: "Data Privacy Agreement Accepted",
  signature: "Signature",
  willing_to_work_onsite: "Willing to Work Onsite",
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString("en-US", {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
    }) + " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  } catch {
    return dateStr
  }
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    if (value.length === 0) return "-";
    return value.map((v) => {
      const s = String(v ?? "")
      return s.match(/^\d{4}-\d{2}-\d{2}T/) ? formatDate(s) : s
    }).join(", ");
  }
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) return formatDate(value)
  return String(value);
}

function Field({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm whitespace-pre-wrap break-words">
        {renderValue(value)}
      </p>
    </div>
  )
}

function getOptionValue(opt: unknown): string {
  if (typeof opt === "string") return opt
  if (opt && typeof opt === "object") {
    const v = (opt as Record<string, unknown>).value
    return v != null ? String(v) : ""
  }
  return String(opt ?? "")
}

function QuestionField({ question, answer, options, questionType }: {
  question: string
  answer: unknown
  options?: Array<unknown>
  questionType: string
}) {
  const selected = Array.isArray(answer)
    ? answer.map((v) => String(v ?? ""))
    : answer != null && answer !== ""
    ? [String(answer)]
    : []

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{question}</label>
      {options && options.length > 0 && (questionType === "multiple_choices" || questionType === "checkboxes") ? (
        <div className="space-y-1.5">
          {options.map((opt, i) => {
            const val = getOptionValue(opt)
            const isSelected = selected.includes(val)
            return (
              <div
                key={i}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm ${
                  isSelected
                    ? "border-blue-400 bg-blue-50 text-blue-800 font-medium"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              >
                {questionType === "checkboxes" ? (
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    isSelected ? "bg-blue-600 border-blue-600" : "border-gray-400"
                  }`}>
                    {isSelected && <span className="text-white text-[10px]">&#10003;</span>}
                  </div>
                ) : (
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? "bg-blue-600 border-blue-600" : "border-gray-400"
                  }`}>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                )}
                <span>{val}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm whitespace-pre-wrap break-words">
          {selected.length > 0 ? selected.join(", ") : "-"}
        </p>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="flex-1 h-px bg-blue-500" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function renderFields(data: Record<string, unknown>, fields: string[]) {
  return fields
    .filter((f) => data[f] !== undefined && data[f] !== null && data[f] !== "")
    .map((f) => (
      <Field key={f} label={fieldLabels[f] || f} value={data[f]} />
    ))
}

export default function AnsweredForm({ snapshot, questionnaireSnapshot, questionnaireSections }: AnsweredFormProps) {
  const personalInfo = (snapshot.personal_info ?? {}) as Record<string, unknown>
  const jobDetails = (snapshot.job_details ?? {}) as Record<string, unknown>
  const educationWork = (snapshot.education_work ?? {}) as Record<string, unknown>
  const acknowledgement = (snapshot.acknowledgement ?? {}) as Record<string, unknown>
  const workExperience = (educationWork.workExperience ?? educationWork.work_experience ?? []) as Array<Record<string, unknown>>

  return (
    <div className="mt-6 space-y-8">
      {/* Personal Information */}
      <Section title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderFields(personalInfo, ["firstName", "lastName", "birthday", "gender"])}
        </div>
      </Section>

      {/* Contact Information */}
      <Section title="Contact Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderFields(personalInfo, ["primaryContact", "secondaryContact", "email", "linkedinProfile"])}
        </div>
      </Section>

      {/* Address Information */}
      <Section title="Address Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderFields(personalInfo, ["addressLine1", "city", "district", "postalCode", "country"])}
        </div>
      </Section>

      {/* Job Details */}
      <Section title="Job Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderFields(jobDetails, ["expectedSalary", "willingToWorkOnsite"])}
        </div>
        {jobDetails.interviewSchedule && Array.isArray(jobDetails.interviewSchedule) && (
          <Field label="Preferred Interview Schedule" value={jobDetails.interviewSchedule} />
        )}
      </Section>

      {/* Education */}
      <Section title="Education">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderFields(educationWork, ["highestEducation", "yearGraduated", "institution", "program"])}
        </div>
      </Section>

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <Section title="Work Experience">
          {workExperience.map((exp, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{idx + 1}</Badge>
                <span className="text-sm font-medium text-gray-900">{exp.jobTitle || exp.job_title || `Entry ${idx + 1}`}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Company" value={exp.company} />
                <Field label="Job Title" value={exp.jobTitle || exp.job_title} />
                <Field label="Years" value={exp.years} />
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Acknowledgement */}
      <Section title="Acknowledgement">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderFields(acknowledgement, ["howDidYouLearn", "certificationAccepted", "signature"])}
        </div>
      </Section>

      {/* Form Questionnaire */}
      {questionnaireSections && questionnaireSections.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-900">Form Questionnaire</h3>
            <div className="flex-1 h-px bg-blue-500" />
          </div>
          {questionnaireSections.map((section) => {
            const visible = section.questionnaires.filter((q) => q.question?.trim())
            if (visible.length === 0) return null
            return (
              <div key={section.id ?? section.name} className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800">{section.name}</h4>
                <div className="space-y-4 pl-2">
                  {visible.map((q) => (
                    <QuestionField
                      key={q.id}
                      question={q.question}
                      answer={questionnaireSnapshot[String(q.id)]}
                      options={q.options as Array<unknown> | undefined}
                      questionType={q.question_type}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {(!questionnaireSections || questionnaireSections.length === 0) && Object.keys(questionnaireSnapshot).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-900">Form Questionnaire</h3>
            <div className="flex-1 h-px bg-blue-500" />
          </div>
          <div className="space-y-4 pl-2">
            {Object.keys(questionnaireSnapshot).map((key) => (
              <Field key={key} label={`Question ${key}`} value={questionnaireSnapshot[key]} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}