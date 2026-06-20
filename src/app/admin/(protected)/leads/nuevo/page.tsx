import { proxyAdmin } from '@/proxy';
import { getSalesEmails } from '@/lib/auth/authorized-users';
import ManualLeadForm from '@/components/crm/ManualLeadForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewManualLeadPage() {
  // Enforces auth proxy and retrieves session user details
  const { user: currentUser } = await proxyAdmin();

  // If Admin, get authorized CRM sales owners for selector
  const salesEmails = currentUser.role === 'admin' ? Array.from(getSalesEmails()) : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-28 md:pb-6">
      {/* Back Link */}
      <div>
        <Link
          href="/admin/leads"
          className="inline-flex h-11 items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a leads
        </Link>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agregar Nuevo Lead</h1>
        <p className="text-sm text-neutral-400">
          Registra un lead manualmente en el CRM y asigna un responsable operativo.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 shadow-sm backdrop-blur-sm">
        <ManualLeadForm currentUser={currentUser} salesEmails={salesEmails} />
      </div>
    </div>
  );
}
