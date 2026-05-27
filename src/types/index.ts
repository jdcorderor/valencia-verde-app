export type UserRole = "user" | "admin";

export type ReportStatus = "pending" | "in progress" | "done";

export type ReportType = "forest" | "urban" | "industrial" | "grassland" | "other";

export type Priority = "low" | "medium" | "high" | "critical";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  phone: string;
  role: UserRole;
  disabled: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  date: string;
  type: ReportType;
  description: string;
  latitude: number;
  longitude: number;
  priority: Priority;
  image_url: string | null;
  has_injured: boolean;
  injured_details: string | null;
  status: ReportStatus;
  created_at: string;
  users?: User;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  description: string;
  created_at: string;
}
