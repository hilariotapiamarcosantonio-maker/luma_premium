import type {
  CrmLeadOperation,
  CrmStatus,
  CrmPriority,
} from './operations-types';

export interface LeadOperationClientDto {
  lead_id: string;
  crm_status: CrmStatus;
  owner_email: string | null;
  priority: CrmPriority;
  next_action_type: string | null;
  next_action_at: string | null;
  last_contact_at: string | null;
  lost_reason: string | null;
  version: number;
}

export function toLeadOperationClientDto(
  operation: CrmLeadOperation
): LeadOperationClientDto {
  return {
    lead_id: operation.lead_id,
    crm_status: operation.crm_status,
    owner_email: operation.owner_email,
    priority: operation.priority,
    next_action_type: operation.next_action_type,
    next_action_at: operation.next_action_at,
    last_contact_at: operation.last_contact_at,
    lost_reason: operation.lost_reason,
    version: operation.version,
  };
}
