'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { createNoteAction, type NoteClientDto } from '@/app/actions/crm';
import { MessageSquare, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface LeadNotesPanelProps {
  leadId: string;
  initialNotes: NoteClientDto[];
  canEdit: boolean;
}

const MAX_NOTE_LENGTH = 2000;

export default function LeadNotesPanel({ leadId, initialNotes, canEdit }: LeadNotesPanelProps) {
  const [notes, setNotes] = useState<NoteClientDto[]>(initialNotes);
  const [body, setBody] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEdit) return;

    setErrorMessage(null);
    setFieldError(null);
    setSuccessMessage(null);

    const trimmed = body.trim();
    if (!trimmed) {
      setFieldError('La nota no puede estar vacía.');
      return;
    }
    if (trimmed.length > MAX_NOTE_LENGTH) {
      setFieldError(`La nota no puede exceder los ${MAX_NOTE_LENGTH} caracteres.`);
      return;
    }

    setIsSaving(true);
    try {
      const response = await createNoteAction({ lead_id: leadId, body: trimmed });
      if (response.success) {
        // Prepend locally — notes are already newest-first, no full page refetch needed.
        setNotes((current) => [response.note, ...current]);
        setBody('');
        setSuccessMessage('Nota agregada.');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else if (response.fieldErrors?.body) {
        setFieldError(response.fieldErrors.body);
      } else {
        switch (response.error) {
          case 'LEAD_NOT_FOUND':
            setErrorMessage('El lead especificado no existe.');
            break;
          case 'UNAUTHORIZED':
            setErrorMessage('No tienes permiso para agregar notas a este lead.');
            break;
          case 'UNAUTHENTICATED':
            setErrorMessage('Sesión no autenticada. Por favor, inicia sesión nuevamente.');
            break;
          case 'VALIDATION_ERROR':
            setErrorMessage('Revisa el contenido de la nota antes de guardar.');
            break;
          default:
            setErrorMessage('Ocurrió un error inesperado al guardar la nota.');
        }
      }
    } catch {
      setErrorMessage('Error de comunicación con el servidor. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-5">
      <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
        <MessageSquare className="h-4 w-4 text-amber-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
          Notas
        </h2>
        {notes.length > 0 && (
          <span className="ml-auto text-[10px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
            {notes.length}
          </span>
        )}
      </div>

      {canEdit && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider" htmlFor="lead-note-body">
            Agregar nota
          </label>
          <textarea
            id="lead-note-body"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setFieldError(null);
            }}
            disabled={isSaving}
            rows={3}
            maxLength={MAX_NOTE_LENGTH}
            placeholder="Resumen de la conversación, oferta recomendada, valor estimado y siguiente paso…"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 placeholder-neutral-600 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
          />
          {fieldError && (
            <p className="text-xs text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {fieldError}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {successMessage && (
                <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {successMessage}
                </span>
              )}
              {errorMessage && (
                <span className="text-xs text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {errorMessage}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50 select-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Agregar nota'
              )}
            </button>
          </div>
        </form>
      )}

      {notes.length === 0 ? (
        <p className="text-sm text-neutral-500 italic">
          No hay notas registradas para este lead.
        </p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note, index) => (
            <li
              key={index}
              className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4"
            >
              <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap break-words">
                {note.body}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500">
                <span className="font-medium text-neutral-400 break-all">{note.author}</span>
                <span aria-hidden="true">·</span>
                <span>{new Date(note.createdAt).toLocaleString('es-ES')}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
