// Official test suite to verify crm leads validation logic and timezone-stable date conversions
import { joinDateTimeToIso, splitIsoDateTime } from '../src/components/crm/LeadOperationEditor';
import { UpdateOperationSchema } from '../src/lib/crm/operations-schemas';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ FAIL: ${message}`);
  }
  console.log(`✅ PASS: ${message}`);
}

const OriginalDate = globalThis.Date;

// Mocks to simulate browser implementation differences
class MockSafariDate extends OriginalDate {
  constructor(...args: any[]) {
    if (args.length === 1 && typeof args[0] === 'string') {
      const str = args[0];
      // Simulate Safari returning Invalid Date for date-time strings without seconds
      if (str.includes('T') && !/T\d{2}:\d{2}:\d{2}/.test(str)) {
        super('invalid date string to force NaN');
        return;
      }
    }
    if (args.length === 0) {
      super();
    } else if (args.length === 1) {
      super(args[0]);
    } else {
      super(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
  }
}

class MockUtcDate extends OriginalDate {
  constructor(...args: any[]) {
    if (args.length === 1 && typeof args[0] === 'string') {
      const str = args[0];
      // Simulate browser parsing YYYY-MM-DDTHH:mm as UTC
      if (str.includes('T') && !str.endsWith('Z')) {
        super(str + 'Z');
        return;
      }
    }
    if (args.length === 0) {
      super();
    } else if (args.length === 1) {
      super(args[0]);
    } else {
      super(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
  }
}

async function runTests() {
  console.log("=== RUNNING OFFICIAL CRM OPERATION TESTS ===");

  // 1. Simular zona horaria America/Santo_Domingo para todas las pruebas de conversión
  process.env.TZ = 'America/Santo_Domingo';
  console.log("TZ set to:", process.env.TZ);

  // ----------------------------------------------------
  // PRUEBA A: Conversión estable y simétrica bajo America/Santo_Domingo
  // ----------------------------------------------------
  console.log("\n--- PRUEBA A: Conversión estable bajo America/Santo_Domingo ---");
  const testTimes = [
    { date: '2026-06-20', time: '00:00', expectedIso: '2026-06-20T04:00:00.000Z' },
    { date: '2026-06-20', time: '02:30', expectedIso: '2026-06-20T06:30:00.000Z' },
    { date: '2026-06-20', time: '12:00', expectedIso: '2026-06-20T16:00:00.000Z' },
    { date: '2026-06-20', time: '23:59', expectedIso: '2026-06-21T03:59:00.000Z' }
  ];

  for (const t of testTimes) {
    const iso = joinDateTimeToIso(t.date, t.time);
    assert(iso === t.expectedIso, `joinDateTimeToIso(${t.date}, ${t.time}) should be ${t.expectedIso}, got ${iso}`);
    
    const split = splitIsoDateTime(iso);
    assert(split.date === t.date && split.time === t.time, `splitIsoDateTime(${iso}) should return date=${t.date} time=${t.time}, got date=${split.date} time=${split.time}`);
  }
  console.log("✅ Conversiones locales estables y simétricas pasaron con éxito.");

  // ----------------------------------------------------
  // PRUEBA B: Robustez frente a incompatibilidades de navegador (Safari y UTC-fallback)
  // ----------------------------------------------------
  console.log("\n--- PRUEBA B: Robustez de fecha (Safari y UTC browser parsing) ---");
  
  // Test B1: Safari
  globalThis.Date = MockSafariDate as any;
  const safariRes = joinDateTimeToIso('2026-06-20', '15:00');
  assert(safariRes === '2026-06-20T19:00:00.000Z', "Safari simulation: Numeric constructor bypasses string parsing");
  
  // Test B2: UTC Browser
  globalThis.Date = MockUtcDate as any;
  const utcBrowserRes = joinDateTimeToIso('2026-06-20', '02:00');
  assert(utcBrowserRes === '2026-06-20T06:00:00.000Z', "UTC simulation: Numeric constructor prevents day shift");
  
  // Restore Date constructor
  globalThis.Date = OriginalDate;
  console.log("✅ Robustez de constructor numérico demostrada exitosamente.");

  // ----------------------------------------------------
  // PRUEBAS DE VALIDACIÓN DE ESQUEMA (Zod Server Actions Schema)
  // ----------------------------------------------------
  console.log("\n--- PRUEBAS DE VALIDACIÓN DE ESQUEMA (Zod) ---");
  
  const baseData = {
    lead_id: "lm_e2c352945ecc7bde48f8c15d",
    crm_status: "contacted",
    priority: "medium",
    expected_version: 1
  };

  // Case 1: Fecha de próxima acción huérfana + tipo vacío
  const c1 = UpdateOperationSchema.safeParse({
    ...baseData,
    next_action_type: "",
    next_action_at: "2026-06-22T13:00:00.000Z"
  });
  assert(!c1.success, "Debe rechazar próxima acción con tipo vacío");
  if (!c1.success) {
    const error = c1.error.issues.find(i => i.path.includes("next_action_type"));
    assert(!!error && error.message === "Selecciona el tipo de próxima acción.", "Mensaje de error para tipo vacío correcto");
  }

  // Case 2: Tipo y fecha válidos
  const c2 = UpdateOperationSchema.safeParse({
    ...baseData,
    next_action_type: "Llamada",
    next_action_at: "2026-06-22T13:00:00.000Z"
  });
  assert(c2.success, "Debe aceptar tipo y fecha válidos");

  // Case 3: Ambos vacíos
  const c3 = UpdateOperationSchema.safeParse({
    ...baseData,
    next_action_type: null,
    next_action_at: null,
    last_contact_at: null
  });
  assert(c3.success, "Debe aceptar ambos vacíos");

  // Case 4: Último contacto pasado
  const pastIso = new Date(Date.now() - 3600 * 1000).toISOString();
  const c4 = UpdateOperationSchema.safeParse({
    ...baseData,
    last_contact_at: pastIso
  });
  assert(c4.success, "Debe aceptar último contacto pasado");

  // Case 5: Último contacto futuro
  const futureIso = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
  const c5 = UpdateOperationSchema.safeParse({
    ...baseData,
    last_contact_at: futureIso
  });
  assert(!c5.success, "Debe rechazar último contacto futuro");
  if (!c5.success) {
    const error = c5.error.issues.find(i => i.path.includes("last_contact_at"));
    assert(!!error && error.message === "El último contacto no puede ser una fecha futura.", "Mensaje de error para fecha futura correcto");
  }

  console.log("\n🎉 Todas las pruebas oficiales de CRM e integraciones pasaron!");
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
