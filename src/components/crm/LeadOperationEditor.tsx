'use client';

import { useState } from 'react';
import { updateLeadOperationAction } from '@/app/actions/crm';
import type { LeadOperationClientDto } from '@/lib/crm/operations-dto';
import type { UserRole } from '@/lib/auth/authorized-users';
import { LOST_REASON_OPTIONS, LOST_REASON_OTHER, deriveLostReasonSelection, resolveLostReasonValue } from '@/lib/crm/lost-reason-options';
import { splitIsoDateTime, joinDateTimeToIso } from '@/lib/crm/date-time-helpers';
import { AlertTriangle, CheckCircle, Loader2, Lock, Shield } from 'lucide-react';

export { splitIsoDateTime, joinDateTimeToIso };

interface LeadOperationEditorProps {
  leadId: string;
  currentOperation: LeadOperationClientDto | null;
  currentUserRole: UserRole;
  currentUserEmail: string;
  salesEmails: string[];
  canEdit: boolean;
}


const CRM_STATUSES = [
  { value: 'new', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'qualified', label: 'Calificado' },
  { value: 'meeting_scheduled', label: 'Reunión Programada' },
  { value: 'diagnosis_completed', label: 'Diagnóstico Realizado' },
  { value: 'demo_completed', label: 'Demo Realizada' },
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

  // Form Field States
  const [crmStatus, setCrmStatus] = useState<string>(currentOperation?.crm_status ?? 'new');
  const [priority, setPriority] = useState<string>(currentOperation?.priority ?? 'medium');
  const [ownerEmail, setOwnerEmail] = useState<string>(currentOperation?.owner_email ?? '');
  const [nextActionType, setNextActionType] = useState<string>(currentOperation?.next_action_type ?? '');

  const initialNextAction = currentOperation?.next_action_type
    ? splitIsoDateTime(currentOperation?.next_action_at)
    : { date: '', time: '' };
  const [nextActionDate, setNextActionDate] = useState<string>(initialNextAction.date);
  const [nextActionTime, setNextActionTime] = useState<string>(initialNextAction.time);

  const initialLastContact = splitIsoDateTime(currentOperation?.last_contact_at);
  const [lastContactDate, setLastContactDate] = useState<string>(initialLastContact.date);
  const [lastContactTime, setLastContactTime] = useState<string>(initialLastContact.time);

  const initialLostReason = deriveLostReasonSelection(currentOperation?.lost_reason);
  const [lostReasonSelection, setLostReasonSelection] = useState<string>(initialLostReason.selection);
  const [lostReasonCustomText, setLostReasonCustomText] = useState<string>(initialLostReason.customText);

  // UI Flow States
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localValidationError, setLocalValidationError] = useState<string | null>(null);
  // Field-specific validation messages returned by the server (keyed by field name).
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Client-side inline validation helpers
  const getNextActionError = (): string | null => {
    const type = (nextActionType || '').trim();
    const date = (nextActionDate || '').trim();
    const time = (nextActionTime || '').trim();

    if (!type && !date && !time) {
      return null;
    }

    if (type && !date) {
      return 'Selecciona la fecha de la próxima acción.';
    }

    if (date && !type) {
      return 'Selecciona el tipo de próxima acción.';
    }

    if (date && !time) {
      return 'Selecciona una hora para completar la próxima acción.';
    }

    if (!date && time) {
      return 'Selecciona la fecha de la próxima acción.';
    }

    if (date && time) {
      const iso = joinDateTimeToIso(date, time);
      if (iso === 'INVALID_DATE') {
        return 'Revisa la fecha y la hora antes de guardar.';
      }
    }
    return null;
  };

  const getLastContactError = (): string | null => {
    const dTrim = (lastContactDate || '').trim();
    const tTrim = (lastContactTime || '').trim();
    if (dTrim && !tTrim) {
      return 'Selecciona una hora para completar la fecha.';
    }
    if (!dTrim && tTrim) {
      return 'Selecciona una fecha para completar este campo.';
    }
    if (dTrim && tTrim) {
      const iso = joinDateTimeToIso(dTrim, tTrim);
      if (iso === 'INVALID_DATE') {
        return 'Revisa la fecha y la hora antes de guardar.';
      }
    }
    return null;
  };

  // Future-date check for last_contact_at. Kept out of the render-phase helper above because it
  // relies on the current time (Date.now), which must only be read inside event handlers.
  const getLastContactFutureError = (): string | null => {
    const iso = joinDateTimeToIso(lastContactDate, lastContactTime);
    if (iso && iso !== 'INVALID_DATE') {
      const SKEW_TOLERANCE_MS = 5 * 60 * 1000;
      if (new Date(iso).getTime() > Date.now() + SKEW_TOLERANCE_MS) {
        return 'El último contacto no puede ser una fecha futura.';
      }
    }
    return null;
  };

  // Next action type change handler
  const handleNextActionTypeChange = (val: string) => {
    setNextActionType(val);

    // Clear next_action_type error immediately
    setFieldErrors((prev) => {
      if (!prev.next_action_type) return prev;
      const next = { ...prev };
      delete next.next_action_type;
      return next;
    });

    if (!val.trim()) {
      // Clear fields when type is empty
      setNextActionDate('');
      setNextActionTime('');
      // Clear next_action_at error as well
      setFieldErrors((prev) => {
        if (!prev.next_action_at) return prev;
        const next = { ...prev };
        delete next.next_action_at;
        return next;
      });
    }
  };

  // Next action date change handler (no default "09:00" time)
  const handleNextActionDateChange = (val: string) => {
    setNextActionDate(val);
    setFieldErrors((prev) => {
      if (!prev.next_action_at) return prev;
      const next = { ...prev };
      delete next.next_action_at;
      return next;
    });
  };

  // Next action time change handler
  const handleNextActionTimeChange = (val: string) => {
    setNextActionTime(val);
    setFieldErrors((prev) => {
      if (!prev.next_action_at) return prev;
      const next = { ...prev };
      delete next.next_action_at;
      return next;
    });
  };

  // Last contact date change handler
  const handleLastContactDateChange = (val: string) => {
    setLastContactDate(val);
    setFieldErrors((prev) => {
      if (!prev.last_contact_at) return prev;
      const next = { ...prev };
      delete next.last_contact_at;
      return next;
    });
  };

  // Last contact time change handler
  const handleLastContactTimeChange = (val: string) => {
    setLastContactTime(val);
    setFieldErrors((prev) => {
      if (!prev.last_contact_at) return prev;
      const next = { ...prev };
      delete next.last_contact_at;
      return next;
    });
  };

  // Last contact 'Marcar ahora' button handler
  const handleSetLastContactNow = () => {
    const now = new Date();
    const pad = (num: number) => String(num).padStart(2, '0');
    const dStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const tStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setLastContactDate(dStr);
    setLastContactTime(tStr);
    setFieldErrors((prev) => {
      if (!prev.last_contact_at) return prev;
      const next = { ...prev };
      delete next.last_contact_at;
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    // Reset feedback states
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    setLocalValidationError(null);
    setFieldErrors({});

    // Validate date/time pairs first
    const nextActionErr = getNextActionError();
    const lastContactErr = getLastContactError();
    if (nextActionErr || lastContactErr) {
      setErrorMessage(nextActionErr || lastContactErr || 'Revisa la fecha y la hora antes de guardar.');
      setIsSaving(false);
      return;
    }

    // last_contact_at must never be in the future (it may be in the past, even before creation).
    const lastContactFutureErr = getLastContactFutureError();
    if (lastContactFutureErr) {
      setFieldErrors({ last_contact_at: lastContactFutureErr });
      setErrorMessage('Revisa los campos marcados antes de guardar.');
      setIsSaving(false);
      return;
    }

    // Client-side validation for lost_reason
    const effectiveLostReason = resolveLostReasonValue(lostReasonSelection, lostReasonCustomText);
    if (crmStatus === 'lost' && !effectiveLostReason) {
      setLocalValidationError('El motivo de pérdida es obligatorio.');
      setIsSaving(false);
      return;
    }

    try {
      const nextActionIso = nextActionType.trim() ? joinDateTimeToIso(nextActionDate, nextActionTime) : null;
      const lastContactIso = joinDateTimeToIso(lastContactDate, lastContactTime);

      // Build clean explicit payload
      const payload: Record<string, unknown> = {
        lead_id: leadId,
        crm_status: crmStatus,
        priority: priority,
        next_action_type: nextActionType.trim() || null,
        next_action_at: nextActionIso,
        last_contact_at: lastContactIso,
        expected_version: operation?.version ?? 0,
      };

      if (crmStatus === 'lost') {
        payload.lost_reason = effectiveLostReason || null;
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

        const nextActionSplit = op.next_action_type
          ? splitIsoDateTime(op.next_action_at)
          : { date: '', time: '' };
        setNextActionDate(nextActionSplit.date);
        setNextActionTime(nextActionSplit.time);

        const lastContactSplit = splitIsoDateTime(op.last_contact_at);
        setLastContactDate(lastContactSplit.date);
        setLastContactTime(lastContactSplit.time);

        const lostReasonSplit = deriveLostReasonSelection(op.lost_reason);
        setLostReasonSelection(lostReasonSplit.selection);
        setLostReasonCustomText(lostReasonSplit.customText);

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
            if (response.fieldErrors && Object.keys(response.fieldErrors).length > 0) {
              setFieldErrors(response.fieldErrors);
              setErrorMessage('Revisa los campos marcados antes de guardar.');
            } else {
              setErrorMessage('Revisa los campos marcados antes de guardar.');
            }
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

      <form onSubmit={handleSave} noValidate className="space-y-5">
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
              <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2.5 text-sm text-neutral-400">
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
              onChange={(e) => handleNextActionTypeChange(e.target.value)}
              disabled={!canEdit}
              placeholder="Llamada, Correo, Demo..."
              maxLength={100}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 placeholder-neutral-600 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
            />
          </div>

          {/* Next Action Date (Conditional on type being selected) */}
          {nextActionType.trim() !== '' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Fecha Próxima Acción
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(150px,170px)] gap-2">
                <input
                  type="date"
                  value={nextActionDate}
                  onChange={(e) => handleNextActionDateChange(e.target.value)}
                  disabled={!canEdit}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
                />
                <input
                  type="time"
                  value={nextActionTime}
                  onChange={(e) => handleNextActionTimeChange(e.target.value)}
                  disabled={!canEdit}
                  className="w-full min-w-[150px] rounded-lg border border-neutral-800 bg-neutral-950 px-3 pr-10 py-2 text-sm text-neutral-100 [color-scheme:dark] focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
                />
              </div>
              {(getNextActionError() || fieldErrors.next_action_at || fieldErrors.next_action_type) && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1 select-none">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  {getNextActionError() || fieldErrors.next_action_at || fieldErrors.next_action_type}
                </p>
              )}
            </div>
          )}

          {/* Last Contact Date */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Último Contacto
              </label>
              {canEdit && (
                <button
                  type="button"
                  onClick={handleSetLastContactNow}
                  className="text-[11px] font-semibold text-amber-500 hover:text-amber-400 hover:underline select-none"
                >
                  Marcar ahora
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(150px,170px)] gap-2">
              <input
                type="date"
                value={lastContactDate}
                onChange={(e) => handleLastContactDateChange(e.target.value)}
                disabled={!canEdit}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
              />
              <input
                type="time"
                value={lastContactTime}
                onChange={(e) => handleLastContactTimeChange(e.target.value)}
                disabled={!canEdit}
                className="w-full min-w-[150px] rounded-lg border border-neutral-800 bg-neutral-950 px-3 pr-10 py-2 text-sm text-neutral-100 [color-scheme:dark] focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
              />
            </div>
            {(getLastContactError() || fieldErrors.last_contact_at) && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1 select-none">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {getLastContactError() || fieldErrors.last_contact_at}
              </p>
            )}
          </div>
        </div>

        {/* Lost Reason (Conditional) */}
        {crmStatus === 'lost' && (
          <div className="pt-2 animate-fadeIn space-y-3">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Motivo de Pérdida <span className="text-red-500">*</span>
              </label>
              <select
                value={lostReasonSelection}
                onChange={(e) => setLostReasonSelection(e.target.value)}
                disabled={!canEdit}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
              >
                <option value="" disabled>
                  Selecciona un motivo
                </option>
                {LOST_REASON_OPTIONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {lostReasonSelection === LOST_REASON_OTHER && (
              <textarea
                value={lostReasonCustomText}
                onChange={(e) => setLostReasonCustomText(e.target.value)}
                disabled={!canEdit}
                rows={3}
                placeholder="Especifica detalladamente el motivo de pérdida..."
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 placeholder-neutral-600 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
              />
            )}

            {(localValidationError || fieldErrors.lost_reason) && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                {localValidationError || fieldErrors.lost_reason}
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
