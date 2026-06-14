import { NextResponse } from 'next/server';
import { appendLumaLead, appendLumaLeadV2 } from '@/lib/google-sheets';

// ─── Validation helpers ───────────────────────────────────────────────────────

function sanitize(val: unknown, maxLen = 500): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen).replace(/[<>]/g, '');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body._website) {
      return NextResponse.json({ success: true });
    }

    const schemaVersion = sanitize(body.schema_version, 5) || '1';

    // ── V2: multi-industry form ──
    if (schemaVersion === '2') {
      const full_name = sanitize(body.full_name, 120);
      const email = sanitize(body.email, 200).toLowerCase();

      if (!full_name) {
        return NextResponse.json({ error: 'El nombre es obligatorio.' }, { status: 400 });
      }
      if (!isValidEmail(email)) {
        return NextResponse.json({ error: 'Ingrese un correo válido.' }, { status: 400 });
      }

      await appendLumaLeadV2({
        locale:               sanitize(body.locale, 5)               || 'es',
        country:              sanitize(body.country, 5)              || '',
        full_name,
        email,
        phone:                sanitize(body.phone, 30)               || '',
        company:              sanitize(body.company, 150)            || '',
        role:                 sanitize(body.role, 100)               || '',
        industry:             sanitize(body.industry, 50)            || '',
        industry_detail:      sanitize(body.industry_detail, 300)    || '',
        team_size:            sanitize(body.team_size, 50)           || '',
        lead_volume:          sanitize(body.lead_volume, 50)         || '',
        acquisition_channels: sanitize(body.acquisition_channels, 300) || '',
        advertising_status:   sanitize(body.advertising_status, 100) || '',
        current_tools:        sanitize(body.current_tools, 300)      || '',
        main_bottleneck:      sanitize(body.main_bottleneck, 1000)   || '',
        desired_outcome:      sanitize(body.desired_outcome, 800)    || '',
        solution_interest:    sanitize(body.solution_interest, 200)  || '',
        timeline:             sanitize(body.timeline, 100)           || '',
        investment_range:     sanitize(body.investment_range, 100)   || '',
        source:               sanitize(body.source, 100)             || 'diagnostico',
        page_origin:          sanitize(body.page_origin, 300)        || '',
        utm_source:           sanitize(body.utm_source, 100)         || '',
        utm_medium:           sanitize(body.utm_medium, 100)         || '',
        utm_campaign:         sanitize(body.utm_campaign, 200)       || '',
        utm_content:          sanitize(body.utm_content, 200)        || '',
        utm_term:             sanitize(body.utm_term, 200)           || '',
      });

      return NextResponse.json({ success: true, message: 'Evaluación recibida.' });
    }

    // ── V1: legacy real-estate form (backward compatibility) ──
    const { name, email, operationType, propertyVolume, channels, investsInAds, usesCrm, painPoint, investmentRange } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'El nombre y correo son obligatorios' }, { status: 400 });
    }

    await appendLumaLead([
      new Date().toISOString(),
      sanitize(name, 120),
      sanitize(email, 200),
      sanitize(operationType, 100) || 'No especificado',
      sanitize(propertyVolume, 100) || 'No especificado',
      sanitize(channels, 300) || 'No especificado',
      sanitize(investsInAds, 100) || 'No especificado',
      sanitize(usesCrm, 200) || 'No especificado',
      sanitize(painPoint, 1000) || 'No especificado',
      sanitize(investmentRange, 100) || 'No especificado',
    ]);

    return NextResponse.json({ success: true, message: 'Lead guardado exitosamente.' });
  } catch (error) {
    console.error('Error en API de Luma Leads:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
