import 'server-only';
import {
  CrmLeadOperation,
  CrmLeadNote,
  CrmActivityLog,
  UpdateOperationInput,
  CreateNoteInput,
  OperationsFilters
} from './operations-types';

export interface CrmOperationsRepository {
  getOperationByLeadId(leadId: string): Promise<CrmLeadOperation | null>;
  listOperations(filters?: OperationsFilters): Promise<CrmLeadOperation[]>;
  upsertOperation(input: UpdateOperationInput): Promise<CrmLeadOperation>;
  listNotes(leadId: string): Promise<CrmLeadNote[]>;
  createNote(input: CreateNoteInput): Promise<CrmLeadNote>;
  listActivity(leadId: string): Promise<CrmActivityLog[]>;
}
