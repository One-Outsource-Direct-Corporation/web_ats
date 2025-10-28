export interface Applicant {
  id: string;
  name: string;
  email: string;
  status?: string;
  position?: string;
  department?: string;
  type?: string; // employment type
  avatar?: string;
}
