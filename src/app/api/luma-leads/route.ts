import { NextResponse } from 'next/server';
import { appendLumaLead } from '@/lib/google-sheets';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extraer campos del body (basado en el formulario de diagnóstico)
    const {
      name,
      email,
      operationType,
      propertyVolume,
      channels,
      investsInAds,
      usesCrm,
      painPoint,
      investmentRange
    } = body;

    // Validación básica
    if (!name || !email) {
      return NextResponse.json(
        { error: 'El nombre y correo son obligatorios' },
        { status: 400 }
      );
    }

    // Preparar fila para Google Sheets
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,
      name,
      email,
      operationType || 'No especificado',
      propertyVolume || 'No especificado',
      channels || 'No especificado',
      investsInAds || 'No especificado',
      usesCrm || 'No especificado',
      painPoint || 'No especificado',
      investmentRange || 'No especificado'
    ];

    // Llamar a la librería para insertar en la hoja exclusiva de Luma Leads
    await appendLumaLead(rowData);

    return NextResponse.json({ success: true, message: 'Lead B2B guardado exitosamente' });
  } catch (error) {
    console.error('Error en API de Luma Leads:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al guardar el prospecto' },
      { status: 500 }
    );
  }
}