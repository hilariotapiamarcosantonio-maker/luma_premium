import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

async function createLumaSalesTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Luma Premium';
  workbook.lastModifiedBy = 'Luma Premium';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Premium Styles
  const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' }, // slate-900
  };
  const headerFont = {
    color: { argb: 'FFFFFFFF' },
    bold: true,
    size: 11,
    name: 'Arial'
  };
  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FF334155' } }, // slate-700
    left: { style: 'thin', color: { argb: 'FF334155' } },
    bottom: { style: 'thin', color: { argb: 'FF334155' } },
    right: { style: 'thin', color: { argb: 'FF334155' } }
  };

  // --- Sheet 1: Luma Estate Leads ---
  const leadsSheet = workbook.addWorksheet('Luma Estate Leads', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  const leadColumns = [
    { header: 'created_at', key: 'created_at', width: 22 },
    { header: 'lead_id', key: 'lead_id', width: 15 },
    { header: 'nombre', key: 'nombre', width: 25 },
    { header: 'empresa', key: 'empresa', width: 30 },
    { header: 'cargo', key: 'cargo', width: 25 },
    { header: 'whatsapp', key: 'whatsapp', width: 20 },
    { header: 'email', key: 'email', width: 30 },
    { header: 'tipo_operacion', key: 'tipo_operacion', width: 25 },
    { header: 'cantidad_propiedades', key: 'cantidad_propiedades', width: 25 },
    { header: 'canales_captacion', key: 'canales_captacion', width: 30 },
    { header: 'usa_crm', key: 'usa_crm', width: 25 },
    { header: 'invierte_publicidad', key: 'invierte_publicidad', width: 25 },
    { header: 'fuga_comercial', key: 'fuga_comercial', width: 40 },
    { header: 'rango_inversion', key: 'rango_inversion', width: 25 },
    { header: 'mensaje', key: 'mensaje', width: 40 },
    { header: 'source_page', key: 'source_page', width: 25 },
    { header: 'user_agent', key: 'user_agent', width: 15 },
    { header: 'lead_score', key: 'lead_score', width: 12 },
    { header: 'estado', key: 'estado', width: 20 },
    { header: 'proximo_paso', key: 'proximo_paso', width: 30 },
    { header: 'fecha_proximo_contacto', key: 'fecha_proximo_contacto', width: 22 },
    { header: 'responsable', key: 'responsable', width: 20 },
    { header: 'notas', key: 'notas', width: 40 },
  ];

  leadsSheet.columns = leadColumns;
  leadsSheet.getRow(1).fill = headerFill;
  leadsSheet.getRow(1).font = headerFont;
  leadsSheet.autoFilter = 'A1:W1';

  // Add dummy data
  leadsSheet.addRows([
    {
      created_at: new Date().toISOString(),
      lead_id: 'L-001',
      nombre: 'Juan Pérez (Ejemplo)',
      empresa: 'Inmobiliaria Élite',
      cargo: 'Director Comercial',
      whatsapp: '+18095550000',
      email: 'juan.perez@ejemplo.com',
      tipo_operacion: 'Inmobiliaria Boutique',
      cantidad_propiedades: '21 - 50 propiedades',
      canales_captacion: 'Google Ads, Meta',
      usa_crm: 'No, usamos Excel',
      invierte_publicidad: 'Sí, constantemente',
      fuga_comercial: 'Los leads no contestan rápido',
      rango_inversion: 'US$3,000 - US$6,500',
      estado: 'Nuevo',
      lead_score: 85
    },
    {
      created_at: new Date(Date.now() - 86400000).toISOString(),
      lead_id: 'L-002',
      nombre: 'María López (Ejemplo)',
      empresa: 'Desarrollos PC',
      cargo: 'Owner',
      whatsapp: '+18095550001',
      email: 'maria.lopez@ejemplo.com',
      tipo_operacion: 'Desarrollador de Proyectos',
      cantidad_propiedades: '1 - 5 proyectos exclusivos',
      canales_captacion: 'Referidos, Instagram',
      usa_crm: 'Sí, pero sin integrar',
      invierte_publicidad: 'Sí, de forma esporádica',
      fuga_comercial: 'Falta de atribución de campañas',
      rango_inversion: 'US$6,500 - US$12,000',
      estado: 'Contactado',
      lead_score: 90
    },
    {
      created_at: new Date(Date.now() - 172800000).toISOString(),
      lead_id: 'L-003',
      nombre: 'Carlos Ruiz (Ejemplo)',
      empresa: 'Brokerage Int',
      cargo: 'Top Producer',
      whatsapp: '+18095550002',
      email: 'carlos.ruiz@ejemplo.com',
      tipo_operacion: 'Agente Top Producer',
      cantidad_propiedades: '6 - 20 propiedades',
      canales_captacion: 'Orgánico',
      usa_crm: 'No',
      invierte_publicidad: 'No',
      fuga_comercial: 'Desorden en el seguimiento',
      rango_inversion: 'Aún estoy definiendo la inversión',
      estado: 'Descartado',
      lead_score: 30
    }
  ]);

  // Apply borders
  leadsSheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = thinBorder;
      if (rowNumber > 1) cell.font = { name: 'Arial', size: 10 };
    });
  });

  // --- Sheet 2: Dashboard ---
  const dashSheet = workbook.addWorksheet('Dashboard');
  dashSheet.columns = [
    { width: 30 },
    { width: 20 }
  ];
  
  dashSheet.getCell('A1').value = 'Métricas Ejecutivas Luma Premium';
  dashSheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FF0F172A' } };
  
  const metrics = [
    ['Total leads', "=COUNTA('Luma Estate Leads'!A:A)-1"],
    ['Leads nuevos', "=COUNTIF('Luma Estate Leads'!S:S, \"Nuevo\")"],
    ['Diagnósticos agendados', "=COUNTIF('Luma Estate Leads'!S:S, \"Diagnóstico Agendado\")"],
    ['Propuestas enviadas', "=COUNTIF('Luma Estate Leads'!S:S, \"Propuesta Enviada\")"],
    ['Ganados', "=COUNTIF('Luma Estate Leads'!S:S, \"Ganado\")"],
    ['Perdidos', "=COUNTIF('Luma Estate Leads'!S:S, \"Perdido\")"],
    ['Leads con inversión US$3,000+', "=COUNTIF('Luma Estate Leads'!N:N, \"*US$3,000*\") + COUNTIF('Luma Estate Leads'!N:N, \"*US$6,500*\") + COUNTIF('Luma Estate Leads'!N:N, \"*US$12,000*\")"],
    ['Promedio lead score', "=AVERAGE('Luma Estate Leads'!R:R)"]
  ];

  metrics.forEach((row, index) => {
    const rowNum = index + 3;
    dashSheet.getCell(`A${rowNum}`).value = row[0];
    dashSheet.getCell(`A${rowNum}`).font = { bold: true, color: { argb: 'FF334155' } };
    dashSheet.getCell(`B${rowNum}`).value = { formula: row[1] };
    dashSheet.getCell(`B${rowNum}`).font = { bold: true, color: { argb: 'FF0F172A' } };
    dashSheet.getCell(`A${rowNum}`).border = thinBorder;
    dashSheet.getCell(`B${rowNum}`).border = thinBorder;
  });

  // --- Sheet 3: Catalogs ---
  const catSheet = workbook.addWorksheet('Catalogs');
  catSheet.columns = [
    { header: 'tipo_operacion', width: 30 },
    { header: 'usa_crm', width: 30 },
    { header: 'invierte_publicidad', width: 30 },
    { header: 'rango_inversion', width: 35 },
    { header: 'estado', width: 25 },
    { header: 'responsable', width: 25 }
  ];
  catSheet.getRow(1).fill = headerFill;
  catSheet.getRow(1).font = headerFont;

  const catalogData = {
    tipo_operacion: ['Inmobiliaria Boutique', 'Desarrollador de Proyectos', 'Equipo Comercial Mayorista', 'Agente Top Producer'],
    usa_crm: ['Sí, y tenemos visibilidad de principio a fin', 'Sí, pero no está integrado a la captación', 'No, usamos Excel / WhatsApp para el seguimiento'],
    invierte_publicidad: ['Sí, constantemente', 'Sí, de forma esporádica', 'No, todo es orgánico/referidos'],
    rango_inversion: ['US$1,500 - US$3,000', 'US$3,000 - US$6,500', 'US$6,500 - US$12,000', 'US$12,000+', 'Aún estoy definiendo la inversión'],
    estado: ['Nuevo', 'Contactado', 'Diagnóstico Agendado', 'Diagnóstico Realizado', 'Propuesta Enviada', 'En Negociación', 'Ganado', 'Perdido', 'Descartado', 'Nutrición (Futuro)'],
    responsable: ['Marcos Hilario', 'Equipo Luma']
  };

  const maxRows = Math.max(...Object.values(catalogData).map(arr => arr.length));
  for (let i = 0; i < maxRows; i++) {
    catSheet.addRow([
      catalogData.tipo_operacion[i] || '',
      catalogData.usa_crm[i] || '',
      catalogData.invierte_publicidad[i] || '',
      catalogData.rango_inversion[i] || '',
      catalogData.estado[i] || '',
      catalogData.responsable[i] || ''
    ]);
  }

  // --- Sheet 4: README ---
  const readmeSheet = workbook.addWorksheet('README');
  readmeSheet.columns = [{ width: 100 }];
  
  const readmeContent = [
    ['Luma Premium Sales Leads'],
    [''],
    ['IMPORTANTE:'],
    ['- Esta hoja captura prospectos B2B interesados en comprar Luma Estate OS.'],
    ['- No pertenece al CRM inmobiliario operativo.'],
    ['- No debe mezclarse con compradores de propiedades, visitas, cierres ni comisiones.'],
    ['- La pestaña principal para la integración será exactamente: Luma Estate Leads'],
    ['- Antes de activar pauta, el formulario debe guardar datos reales aquí.']
  ];

  readmeContent.forEach((row, idx) => {
    const cell = readmeSheet.getCell(`A${idx + 1}`);
    cell.value = row[0];
    if (idx === 0) cell.font = { bold: true, size: 16 };
    if (idx === 2) cell.font = { bold: true, color: { argb: 'FFDC2626' } }; // red-600
  });

  // Export
  const outputDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  
  const xlsxPath = path.join(outputDir, 'Luma_Premium_Sales_Leads_Template.xlsx');
  const csvPath = path.join(outputDir, 'luma_estate_google_sheet_columns.csv');

  await workbook.xlsx.writeFile(xlsxPath);
  
  const csvContent = leadColumns.map(c => c.header).join(',');
  fs.writeFileSync(csvPath, csvContent);

  console.log(`Successfully generated:\n- ${xlsxPath}\n- ${csvPath}`);
}

createLumaSalesTemplate().catch(console.error);