import type { CrmStatus, CrmPriority } from './operations-types';

export interface StatusConfig {
  value: CrmStatus;
  label: string;
  badgeClass: string;
}

export const CRM_STATUS_CONFIGS: Record<CrmStatus, StatusConfig> = {
  new: {
    value: 'new',
    label: 'Nuevo',
    badgeClass: 'bg-neutral-900 text-neutral-300 border-neutral-800',
  },
  contacted: {
    value: 'contacted',
    label: 'Contactado',
    badgeClass: 'bg-blue-950/40 text-blue-400 border-blue-900/40',
  },
  qualified: {
    value: 'qualified',
    label: 'Calificado',
    badgeClass: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/40',
  },
  meeting_scheduled: {
    value: 'meeting_scheduled',
    label: 'Reunión Programada',
    badgeClass: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40',
  },
  diagnosis_completed: {
    value: 'diagnosis_completed',
    label: 'Diagnóstico Realizado',
    badgeClass: 'bg-teal-950/40 text-teal-400 border-teal-900/40',
  },
  demo_completed: {
    value: 'demo_completed',
    label: 'Demo Realizada',
    badgeClass: 'bg-violet-950/40 text-violet-400 border-violet-900/40',
  },
  proposal_sent: {
    value: 'proposal_sent',
    label: 'Propuesta Enviada',
    badgeClass: 'bg-cyan-950/40 text-cyan-400 border-cyan-900/40',
  },
  negotiation: {
    value: 'negotiation',
    label: 'Negociación',
    badgeClass: 'bg-orange-950/40 text-orange-400 border-orange-900/40',
  },
  won: {
    value: 'won',
    label: 'Ganado (Won)',
    badgeClass: 'bg-green-950/40 text-green-400 border-green-900/40',
  },
  lost: {
    value: 'lost',
    label: 'Perdido (Lost)',
    badgeClass: 'bg-red-950/40 text-red-400 border-red-900/40',
  },
  nurture: {
    value: 'nurture',
    label: 'En Seguimiento (Nurture)',
    badgeClass: 'bg-pink-950/40 text-pink-400 border-pink-900/40',
  },
};

export const CRM_STATUS_LIST = Object.values(CRM_STATUS_CONFIGS);

export interface PriorityConfig {
  value: CrmPriority;
  label: string;
  badgeClass: string;
}

export const CRM_PRIORITY_CONFIGS: Record<CrmPriority, PriorityConfig> = {
  low: {
    value: 'low',
    label: 'Baja',
    badgeClass: 'bg-neutral-900/60 text-neutral-400 border-neutral-800',
  },
  medium: {
    value: 'medium',
    label: 'Media',
    badgeClass: 'bg-amber-950/40 text-amber-500 border-amber-900/40',
  },
  high: {
    value: 'high',
    label: 'Alta',
    badgeClass: 'bg-red-950/40 text-red-400 border-red-900/40',
  },
};
