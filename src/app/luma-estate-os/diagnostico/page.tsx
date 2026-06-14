import { redirect } from 'next/navigation';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function DiagnosticoRedirect({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const incoming = await searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(incoming)) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value) {
      params.set(key, value);
    }
  }

  params.set('industry', 'real-estate');
  params.set('source', 'luma-estate-os');

  redirect(`/diagnostico?${params.toString()}#assessment-form`);
}
