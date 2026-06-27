// Pure date/time helpers shared by LeadOperationEditor's "next action" and
// "last contact" datetime-local inputs. Kept dependency-free (no React, no
// 'use client', no server-only) so they can be imported and tested in
// isolation without pulling in the rest of the component's module graph.

export function splitIsoDateTime(isoString: string | null | undefined): { date: string; time: string } {
  if (!isoString) return { date: '', time: '' };
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { date: '', time: '' };
    const pad = (num: number) => String(num).padStart(2, '0');
    // Must use browser local timezone methods
    const datePart = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const timePart = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return { date: datePart, time: timePart };
  } catch {
    return { date: '', time: '' };
  }
}

export function joinDateTimeToIso(date: string | null | undefined, time: string | null | undefined): string | null {
  const dTrim = (date || '').trim();
  const tTrim = (time || '').trim();

  if (dTrim === '' && tTrim === '') {
    return null;
  }

  if (dTrim === '' || tTrim === '') {
    return 'INVALID_DATE';
  }

  try {
    const parts = dTrim.split('-');
    if (parts.length !== 3) {
      return 'INVALID_DATE';
    }
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const day = Number(parts[2]);

    const timeParts = tTrim.split(':');
    if (timeParts.length < 2) {
      return 'INVALID_DATE';
    }
    const h = Number(timeParts[0]);
    const min = Number(timeParts[1]);

    const d = new Date(y, m - 1, day, h, min, 0, 0);
    if (isNaN(d.getTime())) {
      return 'INVALID_DATE';
    }
    if (d.getFullYear() !== y || (d.getMonth() + 1) !== m || d.getDate() !== day || d.getHours() !== h || d.getMinutes() !== min) {
      return 'INVALID_DATE';
    }
    return d.toISOString();
  } catch {
    return 'INVALID_DATE';
  }
}
