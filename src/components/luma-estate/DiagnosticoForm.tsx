"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DiagnosticoForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      operationType: formData.get('operationType'),
      propertyVolume: formData.get('propertyVolume'),
      channels: formData.get('channels'),
      investsInAds: formData.get('investsInAds'),
      usesCrm: formData.get('usesCrm'),
      painPoint: formData.get('painPoint'),
      investmentRange: formData.get('investmentRange'),
    };

    try {
      const response = await fetch('/api/luma-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/luma-estate-os/gracias');
      } else {
        const result = await response.json();
        setError(result.error || 'Ocurrió un error al procesar su solicitud.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Error de conexión. Por favor intente nuevamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8 bg-slate-900/30 border border-slate-800 p-8 md:p-12 rounded-2xl" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md text-sm mb-6">
          {error}
        </div>
      )}

      <div className="border-b border-slate-800 pb-8 space-y-8">
        <h3 className="text-xl font-semibold text-white">Datos Ejecutivos</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400">Nombre Completo</label>
            <input type="text" name="name" required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-700" placeholder="Ej. Juan Pérez" />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400">Correo Corporativo</label>
            <input type="email" name="email" required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-700" placeholder="director@suempresa.com" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400">Tipo de Operación</label>
            <select name="operationType" required defaultValue="" className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
              <option value="" disabled>Seleccione el perfil</option>
              <option value="Inmobiliaria Boutique">Inmobiliaria Boutique</option>
              <option value="Desarrollador de Proyectos">Desarrollador de Proyectos</option>
              <option value="Equipo Comercial Mayorista">Equipo Comercial Mayorista</option>
              <option value="Agente Top Producer">Agente Top Producer</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400">Volumen de Propiedades</label>
            <select name="propertyVolume" required defaultValue="" className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
              <option value="" disabled>Cantidad aproximada</option>
              <option value="1 - 5 proyectos exclusivos">1 - 5 proyectos exclusivos</option>
              <option value="6 - 20 propiedades">6 - 20 propiedades</option>
              <option value="21 - 50 propiedades">21 - 50 propiedades</option>
              <option value="Más de 50 propiedades">Más de 50 propiedades</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-800 pb-8 space-y-8">
        <h3 className="text-xl font-semibold text-white">Infraestructura Actual</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400">Canales de Captación</label>
            <input type="text" name="channels" required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-700" placeholder="Meta Ads, Google, Referidos..." />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400">¿Invierten en publicidad?</label>
            <select name="investsInAds" required defaultValue="" className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
              <option value="" disabled>Seleccione opción</option>
              <option value="Sí, constantemente">Sí, constantemente</option>
              <option value="Sí, de forma esporádica">Sí, de forma esporádica</option>
              <option value="No, todo es orgánico/referidos">No, todo es orgánico/referidos</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-400">¿Usan CRM actualmente?</label>
          <select name="usesCrm" required defaultValue="" className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
            <option value="" disabled>Estado tecnológico</option>
            <option value="Sí, y tenemos visibilidad de principio a fin">Sí, y tenemos visibilidad de principio a fin</option>
            <option value="Sí, pero no está integrado a la captación">Sí, pero no está integrado a la captación (mucha carga manual)</option>
            <option value="No, usamos Excel / WhatsApp para el seguimiento">No, usamos Excel / WhatsApp para el seguimiento</option>
          </select>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-xl font-semibold text-white">Objetivo Comercial</h3>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-400">Principal fuga comercial (El &quot;Dolor&quot;)</label>
          <textarea name="painPoint" required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all h-28 placeholder:text-slate-700" placeholder="Ej: Las campañas generan leads pero el equipo no logra contactarlos a tiempo, o no sabemos qué anuncio realmente trajo la venta de alto ticket..." />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-400">Rango de inversión estimado para su infraestructura comercial</label>
          <select name="investmentRange" required defaultValue="" className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
            <option value="" disabled>Seleccione un rango</option>
            <option value="US$1,500 - US$3,000">US$1,500 - US$3,000 (Auditoría / Base inicial)</option>
            <option value="US$3,000 - US$6,500">US$3,000 - US$6,500 (Foundation)</option>
            <option value="US$6,500 - US$12,000">US$6,500 - US$12,000 (Foundation Avanzado)</option>
            <option value="US$12,000+">US$12,000+ (Enterprise / Arquitectura Privada)</option>
            <option value="Aún estoy definiendo la inversión">Aún estoy definiendo la inversión</option>
          </select>
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-white text-slate-950 font-bold p-5 rounded-sm hover:bg-slate-200 transition-colors mt-8 text-lg shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed">
        {isSubmitting ? 'Enviando...' : 'Solicitar Evaluación Ejecutiva'}
      </button>
      
      <p className="text-center text-xs text-slate-600 mt-4">
        Al enviar esta solicitud, confirmas que diriges o eres parte de la directiva de una operación inmobiliaria.
      </p>
    </form>
  );
}