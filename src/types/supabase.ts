
export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "open" | "in-progress" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  created_by: string;
  request_type: "incident" | "anomaly" | "improvement" | "question";
  category: "hardware" | "software" | "network" | "specific_application";
  equipment: "pc" | "mobile" | "server" | "other";
  context?: string;
  expected_behavior?: string;
  actual_behavior?: string;
  screenshot_url?: string;
  reproducibility?: string;
  impacted_user?: string;
  software_version?: string;
  browser_version?: string;
  attempted_actions?: string;
  contact_person?: string;
  availability_slots?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: "user" | "technician" | "admin";
}
