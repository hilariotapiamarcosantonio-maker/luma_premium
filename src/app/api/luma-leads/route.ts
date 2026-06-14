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

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 20 && phone.length <= 30;
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
      const phone = sanitize(body.phone, 30);
      const country = sanitize(body.country, 5);
      const role = sanitize(body.role, 100);
      const industry = sanitize(body.industry, 50);
      const team_size = sanitize(body.team_size, 50);
      const advertising_status = sanitize(body.advertising_status, 100);
      const main_bottleneck = sanitize(body.main_bottleneck, 1000);
      const investment_range = sanitize(body.investment_range, 100);

      if (!full_name) {
        return NextResponse.json({ error: 'El nombre es obligatorio.' }, { status: 400 });
      }
      if (!isValidEmail(email)) {
        return NextResponse.json({ error: 'Ingrese un correo válido.' }, { status: 400 });
      }

      if (!isValidPhone(phone)) {
        return NextResponse.json({ error: 'Ingrese un telefono valido.' }, { status: 400 });
      }
      if (!country || !role || !industry || !team_size || !advertising_status || !main_bottleneck || !investment_range) {
        return NextResponse.json({ error: 'Complete los campos obligatorios.' }, { status: 400 });
      }
      if (body.consent_contact !== true) {
        return NextResponse.json({ error: 'Debe aceptar el consentimiento de contacto.' }, { status: 400 });
      }

      await appendLumaLeadV2({
        locale:               sanitize(body.locale, 5)               || 'es',
        country,
        full_name,
        email,
        phone,
        company:              sanitize(body.company, 150)            || '',
        role,
        industry,
        industry_detail:      sanitize(body.industry_detail, 300)    || '',
        team_size,
        lead_volume:          sanitize(body.lead_volume, 50)         || '',
        acquisition_channels: sanitize(body.acquisition_channels, 300) || '',
        advertising_status,
        current_tools:        sanitize(body.current_tools, 300)      || '',
        main_bottleneck,
        desired_outcome:      sanitize(body.desired_outcome, 800)    || '',
        solution_interest:    sanitize(body.solution_interest, 200)  || '',
        timeline:             sanitize(body.timeline, 100)           || '',
        investment_range,
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
