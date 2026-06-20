import 'server-only';

export type CrmStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'meeting_scheduled'
  | 'proposal_sent'
  | 'negotiation'
  | 'won'
  | 'lost'
  | 'nurture';

export type CrmPriority = 'low' | 'medium' | 'high';

export interface CrmLeadOperation {
  lead_id: string;
  crm_status: CrmStatus;
  owner_email: string | null;
  priority: CrmPriority;
  next_action_type: string | null;
  next_action_at: string | null; // ISO Date String
  last_contact_at: string | null; // ISO Date String
  lost_reason: string | null;
  version: number;
  write_token: string | null;
  created_at: string; // ISO Date String
  updated_at: string; // ISO Date String
  updated_by: string;
}

export interface CrmLeadNote {
  id: string;
  lead_id: string;
  body: string;
  created_by: string;
  created_at: string; // ISO Date String
  updated_at: string | null; // ISO Date String (nullable for future compatibility)
}

export interface CrmActivityLog {
  id: string;
  lead_id: string;
  action_type: string;
  previous_value: string | null;
  new_value: string | null;
  metadata: string | null; // JSON String
  created_by: string;
  created_at: string; // ISO Date String
}

export interface UpdateOperationInput {
  lead_id: string;
  crm_status?: CrmStatus;
  owner_email?: string | null;
  priority?: CrmPriority;
  next_action_type?: string | null;
  next_action_at?: string | null;
  last_contact_at?: string | null;
  lost_reason?: string | null;
  expected_version: number;
}

export interface CreateNoteInput {
  lead_id: string;
  body: string;
}

export interface OperationsFilters {
  crm_status?: CrmStatus;
  owner_email?: string;
  priority?: CrmPriority;
  next_action_due?: 'today' | 'overdue' | 'future' | 'none';
}
