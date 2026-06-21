import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteShell from '@/components/site/SiteShell';
import SolutionLanding from '@/components/site/SolutionLanding';
import { getEnSolution, EN_SOLUTION_SLUGS, EN_SOLUTIONS } from '@/lib/solutions';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return EN_SOLUTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getEnSolution(slug);
  if (!solution) return { title: 'Solution' };
  return {
    title: solution.name,
    description: solution.valueProp ?? solution.positioning,
    alternates: {
      canonical: `/en/solutions/${slug}`,
      languages: { es: `/soluciones/${slug}`, en: `/en/solutions/${slug}` },
    },
    openGraph: {
      title: `${solution.name} | Luma Premium`,
      description: solution.valueProp ?? solution.positioning,
      type: 'website',
      locale: 'en_US',
    },
  };
}

export default async function EnSolutionDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const solution = getEnSolution(slug);
  if (!solution) notFound();

  const related = EN_SOLUTIONS.filter((s) => s.slug !== solution.slug).slice(0, 3);

  return (
    <SiteShell>
      <SolutionLanding solution={solution} locale="en" related={related} />
    </SiteShell>
  );
}
