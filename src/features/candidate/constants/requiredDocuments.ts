export interface CandidateDocument {
  id: number;
  original_filename: string;
  filename: string;
  file_url: string;
  created_at: string;
  document_type: string;
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  nbi_clearance: "NBI Clearance",
  police_clearance: "Police Clearance",
  coe: "Certificate of Employment (COE)",
  itr_2316: "Income Tax Return (ITR 2316)",
  barangay_clearance: "Barangay Clearance",
  dependents_birth_cert: "Photocopy of Dependents Birth Certificate",
  marriage_contract: "Photocopy of Marriage Contract",
  birth_certificate: "Photocopy of Birth Certificate",
  bir_tin_id: "Photocopy of BIR ID / TIN Card",
  sss_id: "Photocopy of SSS ID / E1 Form",
  philhealth: "Photocopy of Philhealth Card",
  pagibig: "Photocopy of Pag-ibig ID",
  loan_voucher: "Photocopy of SSS and Pag-ibig loan voucher",
  other_govt_id: "Photocopy of other Government-Issued IDs",
  photo_2x2: "2 pieces of 2×2 size photo",
  photo_1x1: "2 pieces of 1×1 size photo",
  medical: "Medical Certificate",
  other: "Other",
};

export interface RequiredDocument {
  label: string;
  docType: string;
  keywords: string[];
}

export const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  { label: "NBI Clearance", docType: "nbi_clearance", keywords: ["nbi", "clearance"] },
  { label: "Police Clearance", docType: "police_clearance", keywords: ["police", "clearance"] },
  { label: "Certificate of Employment (COE)", docType: "coe", keywords: ["coe", "certificate of employment"] },
  { label: "Income Tax Return (ITR 2316)", docType: "itr_2316", keywords: ["itr", "tax return", "2316"] },
  { label: "Barangay Clearance", docType: "barangay_clearance", keywords: ["barangay", "clearance"] },
  { label: "Photocopy of Dependents Birth Certificate", docType: "dependents_birth_cert", keywords: ["dependent", "birth certificate"] },
  { label: "Photocopy of Marriage Contract", docType: "marriage_contract", keywords: ["marriage", "contract"] },
  { label: "Photocopy of Birth Certificate", docType: "birth_certificate", keywords: ["birth certificate", "psa"] },
  { label: "Photocopy of BIR ID / TIN Card", docType: "bir_tin_id", keywords: ["bir", "tin"] },
  { label: "Photocopy of SSS ID / E1 Form", docType: "sss_id", keywords: ["sss", "e1"] },
  { label: "Photocopy of Philhealth Card", docType: "philhealth", keywords: ["philhealth"] },
  { label: "Photocopy of Pag-ibig ID", docType: "pagibig", keywords: ["pagibig", "pag-ibig"] },
  { label: "Photocopy of SSS and Pag-ibig loan voucher", docType: "loan_voucher", keywords: ["loan", "voucher"] },
  { label: "Photocopy of other Government-Issued IDs", docType: "other_govt_id", keywords: ["government", "id"] },
  { label: "2 pieces of 2×2 size photo", docType: "photo_2x2", keywords: ["2x2", "2×2"] },
  { label: "2 pieces of 1×1 size photo", docType: "photo_1x1", keywords: ["1x1", "1×1"] },
  { label: "Medical Certificate", docType: "medical", keywords: ["medical", "med cert"] },
];

// Exact label → docType mapping. Only exact matches to avoid false positives.
// For non-matching labels, keyword fallback matching is used instead (Pass 2).
export const LABEL_TO_DOC_TYPE: Record<string, string> = {
  "NBI Clearance": "nbi_clearance",
  "Police Clearance": "police_clearance",
  "Certificate of Employment (COE)": "coe",
  "Income Tax Return (ITR 2316)": "itr_2316",
  "Barangay Clearance": "barangay_clearance",
  "Photocopy of Dependents Birth Certificate": "dependents_birth_cert",
  "Photocopy of Marriage Contract": "marriage_contract",
  "Photocopy of Birth Certificate": "birth_certificate",
  "Photocopy of BIR ID / TIN Card": "bir_tin_id",
  "Photocopy of SSS ID / E1 Form": "sss_id",
  "Photocopy of Philhealth Card": "philhealth",
  "Photocopy of Pag-ibig ID": "pagibig",
  "Photocopy of SSS and Pag-ibig loan voucher": "loan_voucher",
  "Photocopy of other Government-Issued IDs": "other_govt_id",
  "2 pieces of 2×2 size photo": "photo_2x2",
  "2 pieces of 1×1 size photo": "photo_1x1",
  "Medical Certificate": "medical",
};

export function findMatchingDocumentByTypeOrName(
  requirementLabel: string,
  documents: CandidateDocument[],
): CandidateDocument | undefined {
  // Pass 1: Exact document_type match
  const expectedType = LABEL_TO_DOC_TYPE[requirementLabel];
  if (expectedType) {
    const match = documents.find((d) => d.document_type === expectedType);
    if (match) return match;
  }

  // Pass 2: Keyword/name fallback on filename
  const stopWords = [
    "valid", "or", "of", "if", "applicable", "photocopy", "the", "a", "an",
    "certificate", "copy", "for", "and", "with", "other", "size", "pieces",
    "card", "id", "form", "number",
  ];
  const keywords = requirementLabel
    .toLowerCase()
    .replace(/[()]/g, "")
    .split(/\s+/)
    .filter((w) => !stopWords.includes(w) && w.length > 2);
  return documents.find((doc) => {
    const name = (doc.original_filename || doc.filename).toLowerCase();
    return keywords.some((kw) => name.includes(kw));
  });
}
