// Centralized list of standard loss-reason categories. The underlying
// `lost_reason` column stays a free-text string — this is a UX convenience
// (a closed dropdown for the common cases) layered on top, not a schema
// change. Any historical free-text value that doesn't match one of these
// is treated as "Otro" with the original text preserved, never discarded.

export const STANDARD_LOST_REASONS = [
  'Sin presupuesto',
  'No es decisor',
  'Sin urgencia',
  'Eligió otra solución',
  'Dejó de responder',
  'No encaja con el servicio',
  'Proyecto pospuesto',
  'Precio',
  'Alcance insuficiente',
] as const;

export const LOST_REASON_OTHER = 'Otro';

export const LOST_REASON_OPTIONS = [...STANDARD_LOST_REASONS, LOST_REASON_OTHER] as const;

/**
 * Splits a stored `lost_reason` string into a select-friendly shape: either
 * one of the standard categories, or "Otro" with the original text kept
 * (covers both genuinely custom text and pre-existing historical values).
 */
export function deriveLostReasonSelection(value: string | null | undefined): {
  selection: string;
  customText: string;
} {
  const trimmed = (value || '').trim();
  if (!trimmed) return { selection: '', customText: '' };
  if ((STANDARD_LOST_REASONS as readonly string[]).includes(trimmed)) {
    return { selection: trimmed, customText: '' };
  }
  return { selection: LOST_REASON_OTHER, customText: trimmed };
}

/**
 * Resolves the effective `lost_reason` string to persist, given the current
 * selection and (when "Otro" is selected) the custom text typed in.
 */
export function resolveLostReasonValue(selection: string, customText: string): string {
  if (selection === LOST_REASON_OTHER) return customText.trim();
  return selection;
}
