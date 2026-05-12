import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCandidateDetails } from "../hooks/useCandidateDetails";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { formatDate, formatDateYYYYMMDD } from "@/shared/utils/formatDate";
import { ArrowLeft, Plus, Trash2, Upload, FileText, X, Eye, ImageIcon, ChevronDown } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

interface WorkExperienceEntry {
  jobTitle: string;
  company: string;
  years: number;
}

interface FormState {
  first_name: string;
  middle_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  primary_contact_number: string;
  secondary_contact_number: string;
  email: string;
  linkedin_profile: string;
  address_line1: string;
  city: string;
  district: string;
  postal_code: string;
  country: string;
  highest_education: string;
  year_graduated: string;
  institution: string;
  program: string;
  work_experience: WorkExperienceEntry[];
  skills: string[];
}

const initialForm: FormState = {
  first_name: "",
  middle_name: "",
  last_name: "",
  birth_date: "",
  gender: "",
  primary_contact_number: "",
  secondary_contact_number: "",
  email: "",
  linkedin_profile: "",
  address_line1: "",
  city: "",
  district: "",
  postal_code: "",
  country: "",
  highest_education: "",
  year_graduated: "",
  institution: "",
  program: "",
  work_experience: [],
  skills: [],
};

function FieldLabel({ label, required }: { label: string; required: boolean }) {
  return (
    <Label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
  );
}

export default function CandidateProfile() {
  const navigate = useNavigate();
  const { details, config, loading, saving, error, saveDetails } = useCandidateDetails();
  const [form, setForm] = useState<FormState>(initialForm);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [medCertFile, setMedCertFile] = useState<File | null>(null);

  const [isReplacingResume, setIsReplacingResume] = useState(false);
  const [isReplacingPhoto, setIsReplacingPhoto] = useState(false);
  const [isReplacingMedCert, setIsReplacingMedCert] = useState(false);

  useEffect(() => {
    if (details) {
      setForm({
        first_name: details.first_name || "",
        middle_name: details.middle_name || "",
        last_name: details.last_name || "",
        birth_date: details.birth_date || "",
        gender: details.gender || "",
        primary_contact_number: details.primary_contact_number || "",
        secondary_contact_number: details.secondary_contact_number || "",
        email: details.email || "",
        linkedin_profile: details.linkedin_profile || "",
        address_line1: details.address_line1 || "",
        city: details.city || "",
        district: details.district || "",
        postal_code: details.postal_code || "",
        country: details.country || "",
        highest_education: details.highest_education || "",
        year_graduated: details.year_graduated || "",
        institution: details.institution || "",
        program: details.program || "",
        work_experience: Array.isArray(details.work_experience)
          ? details.work_experience.map((w) => ({
              jobTitle: w.jobTitle || "",
              company: w.company || "",
              years: w.years || 0,
            }))
          : [],
        skills: Array.isArray(details.skills) ? details.skills : [],
      });
    }
  }, [details]);

  const isVisible = useCallback(
    (field: string) => {
      if (!config) return true;
      return (config as Record<string, string>)[field] !== "disabled";
    },
    [config]
  );

  const isRequired = useCallback(
    (field: string) => {
      if (!config) return false;
      return (config as Record<string, string>)[field] === "required";
    },
    [config]
  );

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addWorkExperience = () => {
    setForm((prev) => ({
      ...prev,
      work_experience: [...prev.work_experience, { jobTitle: "", company: "", years: 0 }],
    }));
  };

  const removeWorkExperience = (index: number) => {
    setForm((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index),
    }));
  };

  const updateWorkExperience = (index: number, key: keyof WorkExperienceEntry, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    
    setForm((prev) => {
      if (prev.skills.includes(trimmed)) return prev;
      return { ...prev, skills: [...prev.skills, trimmed] };
    });
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    (Object.keys(form) as Array<keyof FormState>).forEach((key) => {
      if (key === "email") return; // Email is read-only — do not submit
      if (key === "work_experience" || key === "skills") {
        formData.append(key, JSON.stringify(form[key]));
      } else {
        formData.append(key, form[key] as string);
      }
    });

    if (resumeFile) formData.append("resume_file", resumeFile);
    if (photoFile) formData.append("photo_2x2_file", photoFile);
    if (medCertFile) formData.append("medical_certificate_file", medCertFile);

    try {
      await saveDetails(formData);
      setResumeFile(null);
      setPhotoFile(null);
      setMedCertFile(null);
      setIsReplacingResume(false);
      setIsReplacingPhoto(false);
      setIsReplacingMedCert(false);
      toast.success("Profile saved successfully!");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/candidate/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <section className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-bold text-[#0056d2] mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isVisible("first_name") && (
                <div>
                  <FieldLabel label="First Name" required={isRequired("first_name")} />
                  <Input value={form.first_name} onChange={(e) => handleChange("first_name", e.target.value)} />
                </div>
              )}
              {isVisible("middle_name") && (
                <div>
                  <FieldLabel label="Middle Name" required={isRequired("middle_name")} />
                  <Input value={form.middle_name} onChange={(e) => handleChange("middle_name", e.target.value)} />
                </div>
              )}
              {isVisible("last_name") && (
                <div>
                  <FieldLabel label="Last Name" required={isRequired("last_name")} />
                  <Input value={form.last_name} onChange={(e) => handleChange("last_name", e.target.value)} />
                </div>
              )}
              {isVisible("birth_date") && (
                <div>
                  <FieldLabel label="Birth Date" required={isRequired("birth_date")} />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                      >
                        {form.birth_date
                          ? formatDate(form.birth_date)
                          : "Select date"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.birth_date ? new Date(form.birth_date) : undefined}
                        onSelect={(date) =>
                          handleChange(
                            "birth_date",
                            date ? formatDateYYYYMMDD(date.toISOString()) : ""
                          )
                        }
                        captionLayout="dropdown-buttons"
                        fromYear={1950}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              {isVisible("gender") && (
                <div>
                  <FieldLabel label="Gender" required={isRequired("gender")} />
                  <Select
                    key={`gender-${form.gender || "__empty__"}`}
                    value={form.gender || "__empty__"}
                    onValueChange={(value) => {
                      // Radix Select fires onValueChange even when re-selecting
                      // the placeholder. Guard against the sentinel value.
                      if (value === "__empty__") {
                        handleChange("gender", "");
                      } else {
                        handleChange("gender", value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty__">Select gender</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {isVisible("primary_contact_number") && (
                <div>
                  <FieldLabel label="Primary Contact Number" required={isRequired("primary_contact_number")} />
                  <Input value={form.primary_contact_number} onChange={(e) => handleChange("primary_contact_number", e.target.value)} />
                </div>
              )}
              {isVisible("secondary_contact_number") && (
                <div>
                  <FieldLabel label="Secondary Contact Number" required={isRequired("secondary_contact_number")} />
                  <Input value={form.secondary_contact_number} onChange={(e) => handleChange("secondary_contact_number", e.target.value)} />
                </div>
              )}
              {isVisible("email") && (
                <div>
                  <FieldLabel label="Email (read-only)" required={false} />
                  <Input type="email" value={form.email} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                </div>
              )}
              {isVisible("linkedin_profile") && (
                <div className="md:col-span-2">
                  <FieldLabel label="LinkedIn Profile" required={isRequired("linkedin_profile")} />
                  <Input value={form.linkedin_profile} onChange={(e) => handleChange("linkedin_profile", e.target.value)} />
                </div>
              )}
            </div>
          </section>

          {/* Address */}
          <section className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-bold text-[#0056d2] mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isVisible("address_line1") && (
                <div className="md:col-span-2">
                  <FieldLabel label="Address Line 1" required={isRequired("address_line1")} />
                  <Input value={form.address_line1} onChange={(e) => handleChange("address_line1", e.target.value)} />
                </div>
              )}
              {isVisible("city") && (
                <div>
                  <FieldLabel label="City" required={isRequired("city")} />
                  <Input value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
                </div>
              )}
              {isVisible("district") && (
                <div>
                  <FieldLabel label="District / State" required={isRequired("district")} />
                  <Input value={form.district} onChange={(e) => handleChange("district", e.target.value)} />
                </div>
              )}
              {isVisible("postal_code") && (
                <div>
                  <FieldLabel label="Postal Code" required={isRequired("postal_code")} />
                  <Input value={form.postal_code} onChange={(e) => handleChange("postal_code", e.target.value)} />
                </div>
              )}
              {isVisible("country") && (
                <div>
                  <FieldLabel label="Country" required={isRequired("country")} />
                  <Input value={form.country} onChange={(e) => handleChange("country", e.target.value)} />
                </div>
              )}
            </div>
          </section>

          {/* Education */}
          <section className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-bold text-[#0056d2] mb-4">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isVisible("highest_education") && (
                <div>
                  <FieldLabel label="Highest Education" required={isRequired("highest_education")} />
                  <Select
                    key={`highest-education-${form.highest_education || "__empty__"}`}
                    value={form.highest_education || "__empty__"}
                    onValueChange={(value) => {
                      if (value === "__empty__") {
                        handleChange("highest_education", "");
                      } else {
                        handleChange("highest_education", value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty__">Select education level</SelectItem>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="associate">Associate Degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor&apos;s Degree</SelectItem>
                      <SelectItem value="master">Master&apos;s Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {isVisible("year_graduated") && (
                <div>
                  <FieldLabel label="Year Graduated" required={isRequired("year_graduated")} />
                  <Input value={form.year_graduated} onChange={(e) => handleChange("year_graduated", e.target.value)} />
                </div>
              )}
              {isVisible("institution") && (
                <div>
                  <FieldLabel label="School / University" required={isRequired("institution")} />
                  <Input value={form.institution} onChange={(e) => handleChange("institution", e.target.value)} />
                </div>
              )}
              {isVisible("program") && (
                <div>
                  <FieldLabel label="Course / Program" required={isRequired("program")} />
                  <Input value={form.program} onChange={(e) => handleChange("program", e.target.value)} />
                </div>
              )}
            </div>
          </section>

          {/* Work Experience */}
          {isVisible("work_experience") && (
            <section className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#0056d2]">Work Experience</h2>
                <Button type="button" variant="outline" size="sm" onClick={addWorkExperience}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Job
                </Button>
              </div>
              <div className="space-y-4">
                {form.work_experience.length === 0 && (
                  <p className="text-sm text-gray-400">No work experience added yet.</p>
                )}
                {form.work_experience.map((entry, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border rounded-lg p-4">
                    <div className="md:col-span-1">
                      <Label className="text-xs text-gray-500">Job Title</Label>
                      <Input
                        value={entry.jobTitle}
                        onChange={(e) => updateWorkExperience(index, "jobTitle", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Label className="text-xs text-gray-500">Company</Label>
                      <Input
                        value={entry.company}
                        onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Label className="text-xs text-gray-500">Years</Label>
                      <Input
                        type="number"
                        min={0}
                        value={entry.years}
                        onChange={(e) => updateWorkExperience(index, "years", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeWorkExperience(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {isVisible("skills") && (
            <section className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-bold text-[#0056d2] mb-4">Skills (Optional)</h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Type a skill and press Enter or click Add"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="flex items-center gap-1 pr-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {form.skills.length === 0 && (
                    <p className="text-sm text-gray-400">No skills added yet.</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Documents */}
          <section className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-bold text-[#0056d2] mb-4">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Resume */}
              {isVisible("resume") && (
                <div>
                  <FieldLabel label="Resume" required={isRequired("resume")} />
                  {details?.resume && !isReplacingResume && !resumeFile ? (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{details.resume.filename}</p>
                          <p className="text-xs text-gray-500">Uploaded</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8"
                          onClick={() => window.open(details.resume!.url, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8 text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => setIsReplacingResume(true)}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Replace
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {resumeFile ? (
                        <div className="text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-sm font-medium text-gray-900 truncate px-2">{resumeFile.name}</p>
                          <p className="text-xs text-gray-500 mb-3">Ready to upload</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-500 hover:text-red-500"
                            onClick={() => {
                              setResumeFile(null);
                              setIsReplacingResume(false);
                            }}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors py-4">
                          <Upload className="h-8 w-8 mb-2 text-gray-400" />
                          <span className="text-sm text-gray-600 font-medium">Click to upload resume</span>
                          <span className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              setResumeFile(e.target.files?.[0] || null);
                              setIsReplacingResume(true);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Photo 2x2 */}
              {isVisible("photo_2x2") && (
                <div>
                  <FieldLabel label="2x2 Photo" required={isRequired("photo_2x2")} />
                  {details?.photo_2x2 && !isReplacingPhoto && !photoFile ? (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-center mb-3">
                        <img
                          src={details.photo_2x2.url}
                          alt="2x2 Photo"
                          className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate text-center mb-1">{details.photo_2x2.filename}</p>
                      <p className="text-xs text-gray-500 text-center mb-3">Uploaded</p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8"
                          onClick={() => window.open(details.photo_2x2!.url, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8 text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => setIsReplacingPhoto(true)}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Replace
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {photoFile ? (
                        <div className="text-center">
                          <img
                            src={URL.createObjectURL(photoFile)}
                            alt="Preview"
                            className="w-24 h-24 mx-auto mb-2 rounded-lg object-cover border border-gray-200"
                          />
                          <p className="text-sm font-medium text-gray-900 truncate px-2">{photoFile.name}</p>
                          <p className="text-xs text-gray-500 mb-3">Ready to upload</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-500 hover:text-red-500"
                            onClick={() => {
                              setPhotoFile(null);
                              setIsReplacingPhoto(false);
                            }}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors py-4">
                          <ImageIcon className="h-8 w-8 mb-2 text-gray-400" />
                          <span className="text-sm text-gray-600 font-medium">Click to upload photo</span>
                          <span className="text-xs text-gray-400 mt-1">JPG, PNG</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              setPhotoFile(e.target.files?.[0] || null);
                              setIsReplacingPhoto(true);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Medical Certificate */}
              {isVisible("medical_certificate") && (
                <div>
                  <FieldLabel label="Medical Certificate" required={isRequired("medical_certificate")} />
                  {details?.medical_certificate && !isReplacingMedCert && !medCertFile ? (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{details.medical_certificate.filename}</p>
                          <p className="text-xs text-gray-500">Uploaded</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8"
                          onClick={() => window.open(details.medical_certificate!.url, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8 text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => setIsReplacingMedCert(true)}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Replace
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {medCertFile ? (
                        <div className="text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-sm font-medium text-gray-900 truncate px-2">{medCertFile.name}</p>
                          <p className="text-xs text-gray-500 mb-3">Ready to upload</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-500 hover:text-red-500"
                            onClick={() => {
                              setMedCertFile(null);
                              setIsReplacingMedCert(false);
                            }}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors py-4">
                          <Upload className="h-8 w-8 mb-2 text-gray-400" />
                          <span className="text-sm text-gray-600 font-medium">Click to upload medical cert</span>
                          <span className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              setMedCertFile(e.target.files?.[0] || null);
                              setIsReplacingMedCert(true);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="bg-[#0056d2] hover:bg-blue-700 text-white px-8">
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
