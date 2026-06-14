import { redirect } from 'next/navigation';

// Redirige al formulario maestro multinicho con el sector inmobiliario preseleccionado.
// Esto elimina el doble formulario desconectado y centraliza todos los leads.
export default function DiagnosticoRedirect() {
  redirect('/diagnostico?industry=real-estate&source=luma-estate-os#assessment-form');
}
