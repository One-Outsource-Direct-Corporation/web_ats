import { useState, useMemo, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table.tsx";
import { Badge } from "@/shared/components/ui/badge.tsx";
import { Textarea } from "@/shared/components/ui/textarea.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { X, Eye, Loader2, Search } from "lucide-react";
import { toast } from "react-toastify";
import { useConfigureJobOffer, useSendJobOffer, useRescindJobOffer } from "@/features/applicants/hooks/useJobOffers";
import { useDeferredAction } from "@/features/applicants/hooks/useDeferredAction";
import { useAuth } from "@/features/auth/hooks/useAuth";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { getProcessTypeLabel } from "@/features/jobs/utils/jobFormatters";
import type { JobOffer } from "@/features/applicants/types/jobOffer.types";
import type { JobPipelineStep, JobPipelineCandidate } from "@/features/jobs/types/job.types";

const OFFER_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  signed: "Signed",
  rescinded: "Rescinded",
};

function getOfferStatusBadge(status: string | undefined) {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    sent: "bg-blue-100 text-blue-700",
    signed: "bg-green-100 text-green-700",
    rescinded: "bg-red-100 text-red-700",
  };
  return colors[status ?? ""] ?? "bg-gray-100 text-gray-700";
}

function formatOfferStatus(status: string | undefined) {
  return OFFER_STATUS_LABELS[status ?? ""] ?? status ?? "Not created";
}

function generateReferenceId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function JobOfferDocumentModal({
  isOpen, onClose, jobOffer, candidateName, jobTitle, companyName, companyLogo, workScheduleText, immediateSupervisorName, onEdit,
}: {
  isOpen: boolean; onClose: () => void; jobOffer?: JobOffer | null; candidateName: string; jobTitle: string;
  companyName?: string; companyLogo?: string; workScheduleText?: string; immediateSupervisorName?: string; onEdit?: () => void;
}) {
  if (!isOpen) return null;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const refId = jobOffer?.reference_id ?? generateReferenceId();
  const basic = jobOffer?.basic_pay ? parseFloat(jobOffer.basic_pay) : 15000;
  const startDateStr = jobOffer?.start_date
    ? new Date(jobOffer.start_date + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "To be mutually agreed upon";
  const allowance = jobOffer?.allowance ? parseFloat(jobOffer.allowance) : 0;
  const transportation = jobOffer?.transportation ? parseFloat(jobOffer.transportation) : 0;
  const mobile = jobOffer?.mobile_allowance ? parseFloat(jobOffer.mobile_allowance) : 0;
  const monthlyTotal = basic + allowance + transportation + mobile;
  const annualTotal = monthlyTotal * 12 + basic;

  // Calculate statutory contributions (Philippine standard rates)
  const sssMonthly = basic * 0.097; // ~9.7% employer share
  const sssAnnual = sssMonthly * 12;
  const philhealthMonthly = basic * 0.025; // ~2.5% employer share
  const philhealthAnnual = philhealthMonthly * 12;
  const pagibigMonthly = basic * 0.02; // 2% employer share
  const pagibigAnnual = pagibigMonthly * 12;

  const vacationCredits = jobOffer?.vacation_leave_credits ? parseInt(jobOffer.vacation_leave_credits) : 5;
  const sickCredits = jobOffer?.sick_leave_credits ? parseInt(jobOffer.sick_leave_credits) : 5;
  const leaveConversionValue = (basic / 22) * Math.min(sickCredits, 5); // Convert up to 5 unused sick leaves

  const benefits = jobOffer?.benefits ?? {};
  const benefitSpecifications: Record<string, string> = {
    birthday_cake: "Subject to the company's affordability",
    hmo: "Available after 8 months of employment, subject to the medical coverage policy and company affordability",
    christmas_package: "Subject to the company's affordability",
    company_events: "Christmas party and regular People Engagement Programs",
    employee_discounts: "Discounts on One Tech Smart Solutions",
    potential_bonus: "Contingent upon the company's financial performance and profitability, as well as individual performance throughout the year",
    annual_increase: "Contingent upon the company's financial performance and profitability, as well as individual performance throughout the year",
    commissions: "Applicable to employees in the Sales Department, based on the company's sales incentives or commission structure program",
    referral_bonuses: "Subject to company referral policy",
    salary_loan: "Available after 6 months of employment, in accordance with the company's employee salary loan assistance policy",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl mx-4 max-h-[95vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            {companyLogo && <img src={companyLogo} alt="Company Logo" className="h-8 w-auto" />}
            <span className="font-semibold text-blue-600">{companyName || "One Outsource"}</span>
            <button onClick={onEdit} className="text-blue-600 text-sm underline">Edit</button>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1"><X className="h-6 w-6" /></button>
        </div>
        <div className="p-8 space-y-6">
          {/* Date and Candidate Info */}
          <div className="space-y-1">
            <p className="font-medium">{today}</p>
            <p className="font-medium">{candidateName}</p>
            <p className="text-sm text-gray-600">Makati City</p>
          </div>

          {/* Reference ID */}
          <div className="mt-4">
            <p className="font-medium text-gray-700">#{refId}</p>
          </div>

          {/* Position Details */}
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
              <span className="font-medium">I. Position</span>
              <span>{jobTitle}</span>
            </div>
            <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
              <span className="font-medium">II. Employment Status</span>
              <span>Trainee</span>
            </div>
            <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
              <span className="font-medium">III. Work Schedule</span>
              <div>
                <span>{workScheduleText || "—"}</span>
                <p className="text-xs text-gray-500 italic">**The company reserves the right to change your schedule as it deems necessary.</p>
              </div>
            </div>
            <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
              <span className="font-medium">IV. Work Assignment</span>
              <div>
                <span>oodc/sdhfjkl</span>
                <p className="text-xs text-gray-500 italic">**The company reserves the right to change your work assignment and duties as it deems necessary.</p>
              </div>
            </div>
            <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
              <span className="font-medium">V. Immediate Head</span>
              <span>{immediateSupervisorName || "Job Title of Person"}</span>
            </div>
            <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
              <span className="font-medium">VI. Start Date</span>
              <span>{startDateStr}</span>
            </div>
          </div>

          {/* Compensation and Benefits Header */}
          <div className="bg-blue-800 text-white text-center py-2 font-bold mt-8">COMPENSATION AND BENEFITS</div>

          {/* CASH Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 font-bold">CASH</th>
                  <th className="text-left py-2 font-bold">Monthly</th>
                  <th className="text-left py-2 font-bold">Annual</th>
                  <th className="text-left py-2 font-bold">Specifications</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pl-4">Basic Pay</td>
                  <td className="py-2">₱{basic.toFixed(2)}</td>
                  <td className="py-2">₱{(basic * 12).toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pl-4">Allowance</td>
                  <td className="py-2">₱{allowance.toFixed(2)}</td>
                  <td className="py-2">₱{(allowance * 12).toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pl-4">Transportation</td>
                  <td className="py-2">₱{transportation.toFixed(2)}</td>
                  <td className="py-2">₱{(transportation * 12).toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pl-4">13th Month Pay</td>
                  <td className="py-2"></td>
                  <td className="py-2">₱{basic.toFixed(2)}</td>
                  <td className="text-xs">1/12 of the annual basic salary/Prorated monthly</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pl-4">Mobile Allowance</td>
                  <td className="py-2">₱{mobile.toFixed(2)}</td>
                  <td className="py-2">₱{(mobile * 12).toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pl-4">Leave Conversion</td>
                  <td className="py-2"></td>
                  <td className="py-2">₱{leaveConversionValue.toFixed(2)}</td>
                  <td className="text-xs">Convert up to 5 unused sick leaves after 1 year of service</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Cash Row */}
          <div className="bg-green-500 text-white font-bold py-2 px-4">
            <table className="w-full text-sm">
              <tr>
                <td className="w-1/4"><span className="underline">Total Cash</span></td>
                <td className="w-1/4">₱{monthlyTotal.toFixed(2)}</td>
                <td className="w-1/4">₱{monthlyTotal.toFixed(2)}</td>
                <td className="w-1/4">₱{annualTotal.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          {/* Other Variable Cash Benefit */}
          <div className="mt-6">
            <h4 className="font-bold text-sm underline mb-3">OTHER VARIABLE CASH BENEFIT</h4>
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pl-4 w-1/3">SSS Employer Share</td>
                  <td className="py-2 w-1/6">₱{sssMonthly.toFixed(2)}</td>
                  <td className="py-2 w-1/6">₱{sssAnnual.toFixed(2)}</td>
                  <td className="py-2"></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pl-4">PhilHealth Employer Share</td>
                  <td className="py-2">₱{philhealthMonthly.toFixed(2)}</td>
                  <td className="py-2">₱{philhealthAnnual.toFixed(2)}</td>
                  <td className="py-2"></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pl-4">Pag-ibig Employer Share</td>
                  <td className="py-2">₱{pagibigMonthly.toFixed(2)}</td>
                  <td className="py-2">₱{pagibigAnnual.toFixed(2)}</td>
                  <td className="py-2"></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pl-4">Vacation Leave Credits</td>
                  <td className="py-2">{vacationCredits}</td>
                  <td className="py-2">₱{(basic / 22 * vacationCredits).toFixed(2)}</td>
                  <td className="py-2 text-xs">5 days annually/subject to company vacation leave policy</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 pl-4">Sick Leave Credits</td>
                  <td className="py-2">{sickCredits}</td>
                  <td className="py-2">₱{(basic / 22 * sickCredits).toFixed(2)}</td>
                  <td className="py-2 text-xs">5 days annually/subject to company sick leave policy</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Other Benefits */}
          <div className="mt-6">
            <h4 className="font-bold text-sm underline mb-3">Other Benefits:</h4>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {BENEFIT_FIELDS.map((bf) => (
                  <tr key={bf.id} className="border-b border-gray-200">
                    <td className="py-2 pl-4 w-1/3">{bf.label}</td>
                    <td className="py-2 w-1/6">{benefits[bf.id] ? "YES" : "NO"}</td>
                    <td className="py-2 text-xs">{benefitSpecifications[bf.id] || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legal Text */}
          <div className="mt-6 text-sm text-gray-700 space-y-2">
            <p>This offer, along with your employment with the company, is contingent upon your successful completion of the medical examination, employment background verification, and all pre-employment requirements. If you accept our offer, please indicate your agreement by signing in the space provided below.</p>
            <p>Thank you, and we look forward to welcoming you to {companyName || "One Outsource"}.</p>
          </div>

          {/* Signature Section */}
          <div className="mt-8 grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-bold mb-4">Prepared by:</p>
              <p className="font-medium">Paula Ray Vizcarra</p>
              <p className="text-gray-600">Specialist, Human Resources</p>
              <p className="text-gray-600">{companyName || "One Outsource Group"}</p>
            </div>
            <div>
              <p className="font-bold mb-4">Conforme:</p>
              <div className="border-b border-black mb-1"></div>
              <p className="font-medium">{candidateName}</p>
              <p className="text-gray-600 text-xs">Signature Over Printed Name</p>
            </div>
          </div>

          <div className="mt-6 text-sm">
            <p className="font-bold mb-4">Noted by:</p>
            <p className="font-medium">Rosemarie David</p>
            <p className="text-gray-600">Manager, Human Resources</p>
            <p className="text-gray-600">{companyName || "One Outsource Group"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, loading }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; loading?: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">{title}</h2>
          <p className="text-black mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50">Cancel</Button>
            <Button onClick={onConfirm} disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const BENEFIT_FIELDS = [
  { id: "birthday_cake", label: "Birthday Cake Benefit" },
  { id: "hmo", label: "HMO" },
  { id: "christmas_package", label: "Christmas Package" },
  { id: "company_events", label: "Company Sponsored Events" },
  { id: "employee_discounts", label: "Employee Discounts" },
  { id: "potential_bonus", label: "Potential Bonus" },
  { id: "annual_increase", label: "Annual Salary Increase" },
  { id: "commissions", label: "Commissions" },
  { id: "referral_bonuses", label: "Referral Bonuses" },
  { id: "salary_loan", label: "Employee Salary Loan Assistance" },
];

function JobOfferFormModal({ isOpen, onClose, onSave, onPreview, onSend, candidateName, jobTitle, existingOffer, defaultSubject, defaultBody, saving }: {
  isOpen: boolean; onClose: () => void; onSave: (formData: Record<string, unknown>) => void;
  onPreview?: () => void; onSend?: () => void; candidateName: string; jobTitle: string;
  existingOffer?: JobOffer | null; defaultSubject?: string; defaultBody?: string; saving?: boolean;
}) {
  const [form, setForm] = useState({ daily_rate: "", minimum_wage: "", basic_pay: "", allowance: "", transportation: "", mobile_allowance: "", vacation_leave_credits: "", sick_leave_credits: "", start_date: "", email_subject: "", email_body: "" });
  const [benefits, setBenefits] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (existingOffer) {
      setForm({
        daily_rate: existingOffer.daily_rate ?? "", minimum_wage: existingOffer.minimum_wage ?? "",
        basic_pay: existingOffer.basic_pay ?? "", allowance: existingOffer.allowance ?? "",
        transportation: existingOffer.transportation ?? "", mobile_allowance: existingOffer.mobile_allowance ?? "",
        vacation_leave_credits: existingOffer.vacation_leave_credits ?? "", sick_leave_credits: existingOffer.sick_leave_credits ?? "",
        start_date: existingOffer.start_date ?? "", email_subject: existingOffer.email_subject ?? "", email_body: existingOffer.email_body ?? "",
      });
      setBenefits(existingOffer.benefits ?? {});
    } else {
      setForm({ daily_rate: "", minimum_wage: "", basic_pay: "", allowance: "", transportation: "", mobile_allowance: "", vacation_leave_credits: "", sick_leave_credits: "", start_date: "", email_subject: defaultSubject ?? "", email_body: defaultBody ?? "" });
      setBenefits({});
    }
  }, [existingOffer, isOpen]);

  function update(field: string, value: string) { setForm((p) => ({ ...p, [field]: value })); }
  function toggleBenefit(id: string) { setBenefits((p) => ({ ...p, [id]: !p[id] })); }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Create Job Offer</h2>
            <hr className="border-blue-600 border-t-2" />
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Daily Rate</Label><Input value={form.daily_rate} onChange={(e) => update("daily_rate", e.target.value)} placeholder="Enter daily rate" /></div>
              <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Minimum Wage</Label><Input value={form.minimum_wage} onChange={(e) => update("minimum_wage", e.target.value)} placeholder="Enter minimum wage" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Basic Pay</Label><Input value={form.basic_pay} onChange={(e) => update("basic_pay", e.target.value)} placeholder="Enter basic pay" /></div>
              <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Allowance</Label><Input value={form.allowance} onChange={(e) => update("allowance", e.target.value)} placeholder="Enter allowance" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Transportation</Label><Input value={form.transportation} onChange={(e) => update("transportation", e.target.value)} placeholder="Enter transportation allowance" /></div>
              <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Mobile Allowance</Label><Input value={form.mobile_allowance} onChange={(e) => update("mobile_allowance", e.target.value)} placeholder="Enter mobile allowance" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Vacation Leave Credits</Label><Input value={form.vacation_leave_credits} onChange={(e) => update("vacation_leave_credits", e.target.value)} placeholder="Enter vacation leave credits" /></div>
              <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Sick Leave Credits</Label><Input value={form.sick_leave_credits} onChange={(e) => update("sick_leave_credits", e.target.value)} placeholder="Enter sick leave credits" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Start Date <span className="text-red-500">*</span></Label><Input type="date" value={form.start_date} onChange={(e) => update("start_date", e.target.value)} required /></div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Other Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BENEFIT_FIELDS.map((bf) => (
                  <div key={bf.id} className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">{bf.label}</Label>
                    <Select value={benefits[bf.id] ? "yes" : "no"} onValueChange={() => toggleBenefit(bf.id)}>
                      <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Configuration</h3>
              <div className="space-y-4">
                <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Subject</Label><Input value={form.email_subject} onChange={(e) => update("email_subject", e.target.value)} placeholder="Enter email subject" /></div>
                <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Body</Label><Textarea value={form.email_body} onChange={(e) => update("email_body", e.target.value)} placeholder="Enter email body" style={{ minHeight: 120 }} /></div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline" onClick={onClose} className="bg-white text-gray-600 border-gray-300 hover:bg-gray-50">Cancel</Button>
            {existingOffer && onPreview && (
              <Button variant="outline" onClick={onPreview}
                className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50">
                Preview
              </Button>
            )}
            {existingOffer && existingOffer.status === "draft" && (
              <Button onClick={onSend}
                className="bg-green-600 text-white hover:bg-green-700">
                Send
              </Button>
            )}
            <Button onClick={() => {
              if (!form.start_date) { toast.error("Start date is required"); return; }
              onSave({ ...form, benefits });
            }} disabled={saving}
              className="bg-blue-600 text-white hover:bg-blue-700">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RejectOfferModal({ isOpen, onClose, applicantName, onReject, loading }: {
  isOpen: boolean; onClose: () => void; applicantName: string;
  onReject: (reason: string, remarks: string) => void; loading?: boolean;
}) {
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  useEffect(() => { if (!isOpen) { setReason(""); setRemarks(""); } }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Reject / Rescind Job Offer</h2>
            <p className="text-gray-700 mb-4">This action will rescind the offer for {applicantName}.</p>
          </div>
          <hr className="border-blue-600 border-t-2 mb-6" />
          <div className="space-y-4">
            <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="qualifications">Does not meet qualifications</SelectItem>
                  <SelectItem value="experience">Insufficient experience</SelectItem>
                  <SelectItem value="salary">Salary expectations too high</SelectItem>
                  <SelectItem value="availability">Availability issues</SelectItem>
                  <SelectItem value="cultural-fit">Not a cultural fit</SelectItem>
                  <SelectItem value="better-candidate">Found a better candidate</SelectItem>
                  <SelectItem value="position-filled">Position already filled</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Remarks</Label>
              <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Add your remarks here..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose} disabled={loading}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50">Cancel</Button>
            <Button onClick={() => onReject(reason, remarks)} disabled={loading || !reason}
              className="bg-blue-600 text-white hover:bg-blue-700">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RescindOfferModal({ isOpen, onClose, applicantName, onRescind, loading, isSigned }: {
  isOpen: boolean; onClose: () => void; applicantName: string;
  onRescind: (reason: string, remarks: string) => void; loading?: boolean; isSigned?: boolean;
}) {
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  useEffect(() => { if (!isOpen) { setReason(""); setRemarks(""); } }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Rescind Job Offer</h2>
            {isSigned && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded p-3 mb-4">
                ⚠️ This candidate has already signed the job offer. Rescinding will cancel the current offer. You can create and send a new offer afterwards.
              </div>
            )}
            <p className="text-gray-700 mb-4">Are you sure you want to rescind the offer made to {applicantName}?</p>
          </div>
          <hr className="border-blue-600 border-t-2 mb-6" />
          <div className="space-y-4">
            <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget-constraints">Budget constraints</SelectItem>
                  <SelectItem value="position-eliminated">Position eliminated</SelectItem>
                  <SelectItem value="hiring-freeze">Hiring freeze</SelectItem>
                  <SelectItem value="better-candidate">Found a better candidate</SelectItem>
                  <SelectItem value="candidate-issues">Issues with candidate background</SelectItem>
                  <SelectItem value="business-changes">Business requirements changed</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Remarks</Label>
              <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Add your remarks here..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose} disabled={loading}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50">Cancel</Button>
            <Button onClick={() => onRescind(reason, remarks)} disabled={loading || !reason}
              className="bg-blue-600 text-white hover:bg-blue-700">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SendConfirmModal({ isOpen, onClose, onSend, applicantName, jobTitle, loading }: {
  isOpen: boolean; onClose: () => void; onSend: () => void; applicantName: string; jobTitle: string; loading?: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Send Job Offer</h2>
          <p className="text-gray-700 mb-2">Are you sure you want to send the job offer to <strong>{applicantName}</strong>?</p>
          <p className="text-gray-600 text-sm mb-6">Position: {jobTitle}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50">Cancel</Button>
            <Button onClick={onSend} disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface JobOfferPipelineTableProps {
  pipelineSteps: JobPipelineStep[];
  jobOffers: JobOffer[];
  jobTitle: string;
  onRefetch?: () => void;
  jobDetail?: any;
}

export default function JobOfferPipelineTable({
  pipelineSteps,
  jobOffers,
  jobTitle,
  onRefetch,
  jobDetail,
}: JobOfferPipelineTableProps) {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { queueAction, processingId } = useDeferredAction();
  const [searchTerm, setSearchTerm] = useState("");
  const configureMutation = useConfigureJobOffer();
  const sendMutation = useSendJobOffer();
  const rescindMutation = useRescindJobOffer();

  const [isJobOfferFormOpen, setIsJobOfferFormOpen] = useState(false);
  const [isJobOfferDocumentOpen, setIsJobOfferDocumentOpen] = useState(false);
  const [isRejectOfferOpen, setIsRejectOfferOpen] = useState(false);
  const [isRescindOfferOpen, setIsRescindOfferOpen] = useState(false);
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [candidateForPreview, setCandidateForPreview] = useState<{
    id: number; name: string; avatar: string; pipelineStepId: number; candidateApplicationId: number; offer?: JobOffer;
    interviewerName?: string; interviewerRole?: string; companyName?: string;
  } | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<{
    id: number; name: string; avatar: string; pipelineStepId: number; candidateApplicationId: number; offer?: JobOffer;
    interviewerName?: string; interviewerRole?: string; companyName?: string;
  } | null>(null);

  // Extract work schedule from job posting
  const wsf = jobDetail?.work_schedule_from;
  const wst = jobDetail?.work_schedule_to;
  const workScheduleText = wsf && wst
    ? `${wsf.substring(0, 5)} - ${wst.substring(0, 5)}`
    : "";

  // Extract immediate supervisor from PRF
  const immediateSupervisor = jobDetail?.prf_nested?.immediate_supervisor;
  const immediateSupervisorName = immediateSupervisor
    ? `${immediateSupervisor.first_name || ""} ${immediateSupervisor.last_name || ""}`.trim() || immediateSupervisor.email
    : "Job Title of Person";

  const stepInterviewerMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const step of pipelineSteps) {
      map.set(Number(step.id), step.interviewerName ?? "");
    }
    return map;
  }, [pipelineSteps]);

  const companyName = user?.company?.name ?? "";
  const interviewerRoleLabel = user?.role
    ? user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  function buildDefaultEmailBody(candidateName: string, interviewerName: string) {
    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || interviewerName || "HR Team";
    return `Dear ${candidateName},

We are pleased to offer you the position of ${jobTitle} with ${companyName || "our company"}.

Best regards,
${fullName}
${interviewerRoleLabel}
${companyName}`;
  }

  const candidates = useMemo(() => {
    const seen = new Set<number>();
    const result: Array<{
      id: number; name: string; avatar: string; pipelineStepId: number; candidateApplicationId: number; offer?: JobOffer;
      interviewerName?: string; interviewerRole?: string; companyName?: string;
    }> = [];
    for (const step of pipelineSteps) {
      const interviewerName = stepInterviewerMap.get(Number(step.id)) ?? "";
      for (const ca of step.candidateApplications ?? []) {
        const candidate = ca as JobPipelineCandidate;
        if (seen.has(candidate.id)) continue;
        seen.add(candidate.id);
        result.push({
          id: candidate.id,
          name: candidate.name,
          avatar: candidate.photoUrl ?? `https://i.pravatar.cc/32?u=${candidate.id}`,
          pipelineStepId: Number(step.id) || 0,
          candidateApplicationId: candidate.id,
          offer: jobOffers.find((o) => o.candidate_application_id === candidate.id),
          interviewerName,
          interviewerRole: interviewerRoleLabel,
          companyName,
        });
      }
    }
    return result;
  }, [pipelineSteps, jobOffers, stepInterviewerMap, companyName]);

  const filteredCandidates = useMemo(
    () => candidates.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [candidates, searchTerm],
  );

  function handleGenerateOrSend(candidate: typeof selectedCandidate) {
    if (!candidate) return;
    setSelectedCandidate(candidate);
    setIsJobOfferFormOpen(true);
  }

  async function handleSave(formData: Record<string, unknown>) {
    if (!selectedCandidate) return;
    setActionLoading(true);
    try {
      const offer = await configureMutation.mutateAsync({
        candidate_application_id: selectedCandidate.candidateApplicationId,
        pipeline_step_id: selectedCandidate.pipelineStepId,
        daily_rate: (formData.daily_rate as string) || null,
        minimum_wage: (formData.minimum_wage as string) || null,
        basic_pay: (formData.basic_pay as string) || null,
        allowance: (formData.allowance as string) || null,
        transportation: (formData.transportation as string) || null,
        mobile_allowance: (formData.mobile_allowance as string) || null,
        vacation_leave_credits: formData.vacation_leave_credits as string,
        sick_leave_credits: formData.sick_leave_credits as string,
        benefits: formData.benefits as Record<string, boolean>,
        start_date: formData.start_date as string,
        email_subject: formData.email_subject as string,
        email_body: formData.email_body as string,
      });
      toast.success("Job offer saved as draft");
      setSelectedCandidate((prev) => prev ? { ...prev, offer } : prev);
      setIsJobOfferFormOpen(false);
      onRefetch?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save job offer");
    } finally {
      setActionLoading(false);
    }
  }

  function handleOpenPreview(candidate: typeof candidateForPreview) {
    setCandidateForPreview(candidate);
    setIsJobOfferDocumentOpen(true);
  }

  async function handleRescind(reason: string, remarks: string) {
    if (!selectedCandidate?.offer) return;
    setActionLoading(true);
    try {
      await rescindMutation.mutateAsync({ job_offer_id: selectedCandidate.offer.id, reason, remarks });
      toast.success("Job offer rescinded");
      setIsRescindOfferOpen(false);
      onRefetch?.();
    } catch { toast.error("Failed to rescind job offer"); }
    finally { setActionLoading(false); }
  }

  async function handleReject(reason: string, remarks: string) {
    await handleRescind(reason, remarks);
  }

  function handlePass(candidate: typeof selectedCandidate) {
    if (!candidate || !candidate.pipelineStepId) return;
    queueAction({
      candidateName: candidate.name,
      label: "Pass",
      dedupKey: `progress-${candidate.candidateApplicationId}-${candidate.pipelineStepId}`,
      candidateId: candidate.candidateApplicationId,
      onCommit: async () => {
        await axiosPrivate.post("/api/candidate/pipeline/progress/", {
          candidate_application_id: candidate.candidateApplicationId,
          pipeline_step_id: candidate.pipelineStepId,
          outcome: "pass",
        });
        toast.success(`${candidate.name} passed to next stage.`);
        onRefetch?.();
      },
    });
  }

  async function handleSendJobOffer() {
    if (!selectedCandidate?.offer) return;
    setActionLoading(true);
    try {
      await sendMutation.mutateAsync({ job_offer_id: selectedCandidate.offer.id });
      toast.success("Job offer sent successfully");
      setIsSendConfirmOpen(false);
      setIsJobOfferFormOpen(false);
      onRefetch?.();
    } catch { toast.error("Failed to send job offer"); }
    finally { setActionLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search applicants..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 text-sm" />
        </div>
        <span className="text-xs text-gray-500">{candidates.length} candidate{candidates.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="rounded-md border bg-white overflow-x-auto">
        <Table className="table-fixed text-xs lg:min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-24 border border-gray-200 py-2 px-3 text-xs lg:text-sm lg:py-3 lg:px-4">ID</TableHead>
              <TableHead className="text-center border border-gray-200 py-2 px-3 w-48 text-xs lg:text-sm lg:py-3 lg:px-4">Full Name</TableHead>
              <TableHead className="border border-gray-200 py-2 px-3 w-32 text-center text-xs lg:text-sm lg:py-3 lg:px-4">Status<br />Job Offer</TableHead>
              <TableHead className="border border-gray-200 py-2 px-3 w-32 text-center text-xs lg:text-sm lg:py-3 lg:px-4">Job Offer</TableHead>
              <TableHead className="border border-gray-200 py-2 px-3 w-80 text-center text-xs lg:text-sm lg:py-3 lg:px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-gray-50 h-16 lg:h-20">
                  <TableCell className="text-center border border-gray-200 py-3 px-3 font-medium text-xs lg:text-sm align-middle">
                    {String(candidate.id).padStart(3, "0")}
                  </TableCell>
                  <TableCell className="border border-gray-200 py-3 px-1 lg:py-4 lg:px-4 align-middle">
                    <div className="flex items-center justify-center gap-2 lg:gap-3">
                      <Avatar className="h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0">
                        <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs lg:text-sm">
                          {candidate.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-xs lg:text-sm break-words leading-tight">{candidate.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 text-xs lg:text-sm align-middle">
                    <Badge className={`${getOfferStatusBadge(candidate.offer?.status)} text-xs`}>
                      {formatOfferStatus(candidate.offer?.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 text-center align-middle">
                    <Button onClick={() => handleGenerateOrSend(candidate)}
                      className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg px-4 py-2 text-xs lg:text-sm whitespace-normal h-10">
                      {candidate.offer
                        ? candidate.offer.status === "draft" ? "Edit & Send"
                          : candidate.offer.status === "sent" ? "Resend"
                            : "View Offer"
                        : "Generate Job Offer"}
                    </Button>
                  </TableCell>
                  <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 align-middle">
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm"
                        className="h-10 bg-white text-green-700 border border-green-500 hover:bg-green-500 hover:text-white rounded-lg px-3 py-1 text-xs"
                        onClick={() => handleOpenPreview(candidate)}>
                        <Eye className="h-3 w-3 mr-1" />View Doc
                      </Button>
                      {candidate.offer?.status === "signed" && candidate.offer.signed_document_url && (
                        <Button variant="outline" size="sm"
                          className="h-10 bg-white text-blue-700 border border-blue-400 hover:bg-blue-400 hover:text-white rounded-lg px-3 py-1 text-xs"
                          onClick={() => window.open(candidate.offer!.signed_document_url, "_blank")}>
                          View Signed
                        </Button>
                      )}
                      {candidate.offer?.status === "signed" && (
                        <Button size="sm"
                          className="h-10 bg-green-600 text-white hover:bg-green-700 rounded-lg px-3 py-1 text-xs"
                          disabled={!!processingId}
                          onClick={() => handlePass(candidate)}>
                          Pass
                        </Button>
                      )}
                      {candidate.offer && candidate.offer.status !== "rescinded" && (
                        <Button variant="outline" size="sm"
                          onClick={() => { setSelectedCandidate(candidate); setIsRescindOfferOpen(true); }}
                          className="h-10 bg-white text-yellow-700 border border-yellow-400 hover:bg-yellow-400 hover:text-white rounded-lg px-3 py-1 text-xs">
                          Rescind Offer
                        </Button>
                      )}
                      {candidate.offer?.status === "signed" && (
                        <Button variant="outline" size="sm"
                          onClick={() => { setSelectedCandidate(candidate); setIsRejectOfferOpen(true); }}
                          className="h-10 bg-white text-red-700 border border-red-400 hover:bg-red-400 hover:text-white rounded-lg px-3 py-1 text-xs">
                          Reject
                        </Button>
                      )}
                      {candidate.offer?.status === "sent" && (
                        <span className="text-xs text-gray-400 italic">Awaiting signature</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="border border-gray-200 p-6 lg:p-8 text-center text-gray-500 text-xs lg:text-sm">
                  {candidates.length === 0
                    ? "No candidates found at the 'For Job Offer' stage."
                    : "No applicants found matching your search."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {searchTerm && (
        <div className="mt-2 text-xs lg:text-sm text-gray-600">
          Showing {filteredCandidates.length} of {candidates.length} applicant{filteredCandidates.length !== 1 ? "s" : ""}
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      )}

      <JobOfferFormModal isOpen={isJobOfferFormOpen}
        onClose={() => setIsJobOfferFormOpen(false)} onSave={handleSave}
        onPreview={() => { if (selectedCandidate) handleOpenPreview(selectedCandidate); }}
        onSend={() => { setIsJobOfferFormOpen(false); setIsSendConfirmOpen(true); }}
        candidateName={selectedCandidate?.name ?? ""} jobTitle={jobTitle}
        existingOffer={selectedCandidate?.offer ?? null}
        defaultSubject={`${getProcessTypeLabel("for_job_offer")} - ${jobTitle}`}
        defaultBody={selectedCandidate ? buildDefaultEmailBody(selectedCandidate.name, selectedCandidate.interviewerName ?? "") : ""}
        saving={actionLoading} />

      <JobOfferDocumentModal isOpen={isJobOfferDocumentOpen}
        onClose={() => setIsJobOfferDocumentOpen(false)}
        onEdit={() => { setSelectedCandidate(candidateForPreview); setIsJobOfferDocumentOpen(false); setIsJobOfferFormOpen(true); }}
        jobOffer={candidateForPreview?.offer ?? null}
        candidateName={candidateForPreview?.name ?? ""} jobTitle={jobTitle}
        companyName={companyName} companyLogo={user?.company?.logo}
        workScheduleText={workScheduleText} immediateSupervisorName={immediateSupervisorName} />

      <RejectOfferModal isOpen={isRejectOfferOpen}
        onClose={() => setIsRejectOfferOpen(false)}
        applicantName={selectedCandidate?.name ?? ""} onReject={handleReject} loading={actionLoading} />

      <RescindOfferModal isOpen={isRescindOfferOpen}
        onClose={() => setIsRescindOfferOpen(false)}
        applicantName={selectedCandidate?.name ?? ""} onRescind={handleRescind} loading={actionLoading}
        isSigned={selectedCandidate?.offer?.status === "signed"} />

      <SendConfirmModal isOpen={isSendConfirmOpen}
        onClose={() => setIsSendConfirmOpen(false)}
        onSend={handleSendJobOffer}
        applicantName={selectedCandidate?.name ?? ""} jobTitle={jobTitle} loading={actionLoading} />
    </div>
  );
}
