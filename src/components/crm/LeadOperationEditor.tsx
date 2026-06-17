'use client';

import { useState } from 'react';
import { updateLeadOperationAction } from '@/app/actions/crm';
import type { LeadOperationClientDto } from '@/lib/crm/operations-dto';
import type { UserRole } from '@/lib/auth/authorized-users';
import { AlertTriangle, CheckCircle, Loader2, Lock, Shield } from 'lucide-react';

interface LeadOperationEditorProps {
  leadId: string;
  currentOperation: LeadOperationClientDto | null;
  currentUserRole: UserRole;
  currentUserEmail: string;
  salesEmails: string[];
  canEdit: boolean;
}

// Helper to convert ISO date string to local datetime-local string (YYYY-MM-DDTHH:mm)
function toDatetimeLocal(isoString: string | null | undefined): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (num: number) => String(num).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
}

// Helper to convert datetime-local input string to ISO string
function toIsoString(localDateTime: string | null | undefined): string | null {
  if (!localDateTime || localDateTime.trim() === '') return null;
  try {
    const d = new Date(localDateTime);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
}

const CRM_STATUSES = [
  { value: 'new', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'qualified', label: 'Calificado' },
  { value: 'meeting_scheduled', label: 'Reunión Programada' },
  { value: 'proposal_sent', label: 'Propuesta Enviada' },
  { value: 'negotiation', label: 'Negociación' },
  { value: 'won', label: 'Ganado (Won)' },
  { value: 'lost', label: 'Perdido (Lost)' },
  { value: 'nurture', label: 'En Seguimiento (Nurture)' },
] as const;

const CRM_PRIORITIES = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
] as const;

export default function LeadOperationEditor({
  leadId,
  currentOperation,
  currentUserRole,
  currentUserEmail,
  salesEmails,
  canEdit,
}: LeadOperationEditorProps) {
  const [operation, setOperation] = useState<LeadOperationClientDto | null>(currentOperation);

  // Form Field States initialized from operation
  const [crmStatus, setCrmStatus] = useState<string>(currentOperation?.crm_status ?? 'new');
  const [priority, setPriority] = useState<string>(currentOperation?.priority ?? 'medium');
  const [ownerEmail, setOwnerEmail] = useState<string>(currentOperation?.owner_email ?? '');
  const [nextActionType, setNextActionType] = useState<string>(currentOperation?.next_action_type ?? '');
  const [nextActionAt, setNextActionAt] = useState<string>(toDatetimeLocal(currentOperation?.next_action_at));
  const [lastContactAt, setLastContactAt] = useState<string>(toDatetimeLocal(currentOperation?.last_contact_at));
  const [lostReason, setLostReason] = useState<string>(currentOperation?.lost_reason ?? '');

  // UI Flow States
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localValidationError, setLocalValidationError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    // Reset feedback states
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    setLocalValidationError(null);

    // Client-side validation for lost_reason
    if (crmStatus === 'lost' && (!lostReason || lostReason.trim().length === 0)) {
      setLocalValidationError('El motivo de pérdida es obligatorio.');
      setIsSaving(false);
      return;
    }

    try {
      // Build clean explicit payload
      const payload: Record<string, unknown> = {
        lead_id: leadId,
        crm_status: crmStatus,
        priority: priority,
        next_action_type: nextActionType.trim() || null,
        next_action_at: toIsoString(nextActionAt),
        last_contact_at: toIsoString(lastContactAt),
        expected_version: operation?.version ?? 0,
      };

      if (crmStatus === 'lost') {
        payload.lost_reason = lostReason.trim() || null;
      } else {
        payload.lost_reason = null;
      }

      if (currentUserRole === 'admin') {
        payload.owner_email = ownerEmail || null;
      }

      const response = await updateLeadOperationAction(payload);

      if (response.success) {
        // Update local operation state and form states
        const op = response.operation;
        setOperation(op);
        setCrmStatus(op.crm_status ?? 'new');
        setPriority(op.priority ?? 'medium');
        setOwnerEmail(op.owner_email ?? '');
        setNextActionType(op.next_action_type ?? '');
        setNextActionAt(toDatetimeLocal(op.next_action_at));
        setLastContactAt(toDatetimeLocal(op.last_contact_at));
        setLostReason(op.lost_reason ?? '');

        setSuccessMessage('Operación guardada con éxito.');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        // Safe UI error mapping
        switch (response.error) {
          case 'CONCURRENCY_ERROR':
            setErrorMessage('Este lead fue modificado por otra persona. Recarga la página para ver los cambios recientes.');
            break;
          case 'UNAUTHORIZED':
            setErrorMessage('No tienes permiso para modificar este lead.');
            break;
          case 'VALIDATION_ERROR':
            setErrorMessage('Revisa los campos marcados antes de guardar.');
            break;
          case 'LEAD_NOT_FOUND':
            setErrorMessage('El lead especificado no existe.');
            break;
          case 'UNAUTHENTICATED':
            setErrorMessage('Sesión no autenticada. Por favor, inicia sesión nuevamente.');
            break;
          default:
            setErrorMessage('Ocurrió un error inesperado al guardar los cambios.');
        }
      }
    } catch {
      setErrorMessage('Error de comunicación con el servidor. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Shield className="h-4.5 w-4.5 text-amber-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            Control de Operación CRM
          </h2>
        </div>
        <div className="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
          Versión: {operation?.version ?? 0}
        </div>
      </div>

      {/* Permissions Banner */}
      {!canEdit && (
        <div className="flex items-center gap-3 rounded-lg border border-red-950/30 bg-red-950/10 p-3.5 text-xs text-red-400">
          <Lock className="h-4.5 w-4.5 shrink-0" />
          <span>
            {currentUserRole === 'sales'
              ? `Modo lectura. Solo puedes editar los leads asignados a tu correo (${currentUserEmail}).`
              : 'Modo lectura. No tienes permisos para editar esta ficha.'}
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* CRM Status */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              Estado CRM
            </label>
            <select
              value={crmStatus}
              onChange={(e) => setCrmStatus(e.target.value)}
              disabled={!canEdit}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
            >
              {CRM_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              Prioridad
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={!canEdit}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
            >
              {CRM_PRIORITIES.map((prio) => (
                <option key={prio.value} value={prio.value}>
                  {prio.label}
                </option>
              ))}
            </select>
          </div>

          {/* Responsable (owner_email) - Admin only editable */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              Responsable
            </label>
            {currentUserRole === 'admin' ? (
              <select
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                disabled={!canEdit}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
              >
                <option value="">Sin asignar</option>
                {salesEmails.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
                {ownerEmail && !salesEmails.includes(ownerEmail) && (
                  <option value={ownerEmail}>{ownerEmail}</option>
                )}
              </select>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2.5 text-sm text-neutral-450">
                <span className="truncate">{ownerEmail || 'Sin asignar'}</span>
                <Lock className="h-3.5 w-3.5 text-neutral-600" />
              </div>
            )}
          </div>

          {/* Next Action Type */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              Próxima Acción
            </label>
            <input
              type="text"
              value={nextActionType}
              onChange={(e) => setNextActionType(e.target.value)}
              disabled={!canEdit}
              placeholder="Llamada, Correo, Demo..."
              maxLength={100}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 placeholder-neutral-600 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
            />
          </div>

          {/* Next Action Date */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              Fecha Próxima Acción
            </label>
            <input
              type="datetime-local"
              value={nextActionAt}
              onChange={(e) => setNextActionAt(e.target.value)}
              disabled={!canEdit}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
            />
          </div>

          {/* Last Contact Date */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              Último Contacto
            </label>
            <input
              type="datetime-local"
              value={lastContactAt}
              onChange={(e) => setLastContactAt(e.target.value)}
              disabled={!canEdit}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
            />
          </div>
        </div>

        {/* Lost Reason (Conditional) */}
        {crmStatus === 'lost' && (
          <div className="pt-2 animate-fadeIn">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              Motivo de Pérdida <span className="text-red-500">*</span>
            </label>
            <textarea
              value={lostReason}
              onChange={(e) => setLostReason(e.target.value)}
              disabled={!canEdit}
              rows={3}
              placeholder="Especifica detalladamente el motivo de pérdida..."
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 placeholder-neutral-600 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
            />
            {localValidationError && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                {localValidationError}
              </p>
            )}
          </div>
        )}

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="flex items-center gap-3 rounded-lg border border-red-950/30 bg-red-950/10 p-3.5 text-xs text-red-400">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-3 rounded-lg border border-emerald-950/30 bg-emerald-950/10 p-3.5 text-xs text-emerald-400">
            <CheckCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Actions */}
        {canEdit && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 text-sm font-semibold text-neutral-950 hover:bg-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 select-none min-h-[40px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
