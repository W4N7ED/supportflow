
export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  created_by: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: "user" | "technician" | "admin";
}
