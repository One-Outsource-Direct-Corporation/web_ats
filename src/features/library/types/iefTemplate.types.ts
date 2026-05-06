export interface IefTemplateRow {
  id?: string | number;
  skill?: string;
  rating?: string | number | null;
  remarks?: string;
}

export interface IefTemplateSection {
  id?: string | number;
  key?: string;
  title?: string;
  description?: string;
  rows?: IefTemplateRow[];
}

export interface IefTemplateRecord {
  id: number;
  user?: number | null;
  name: string;
  description?: string | null;
  sections?: IefTemplateSection[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IefTemplatePayload {
  name: string;
  description: string;
  sections: IefTemplateSection[];
  is_active: boolean;
}
