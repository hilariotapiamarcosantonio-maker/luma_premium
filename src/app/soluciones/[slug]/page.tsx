import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteShell from '@/components/site/SiteShell';
import SolutionLanding from '@/components/site/SolutionLanding';
import { getSolution, SOLUTION_SLUGS, SOLUTIONS } from '@/lib/solutions';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SOLUTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return { title: 'Solución' };
  return {
    title: solution.name,
    description: solution.valueProp ?? solution.positioning,
    alternates: {
      canonical: `/soluciones/${slug}`,
      languages: { es: `/soluciones/${slug}`, en: `/en/solutions/${slug}` },
    },
    openGraph: {
      title: `${solution.name} | Luma Premium`,
      description: solution.valueProp ?? solution.positioning,
      type: 'website',
    },
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const related = SOLUTIONS.filter((s) => s.slug !== solution.slug).slice(0, 3);

  return (
    <SiteShell>
      <SolutionLanding solution={solution} locale="es" related={related} />
    </SiteShell>
  );
}
