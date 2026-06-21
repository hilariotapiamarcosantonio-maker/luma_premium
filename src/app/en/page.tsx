import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import HomeContent from '@/components/site/HomeContent';

export const metadata: Metadata = {
  title: 'Commercial Digital Architecture',
  description:
    'Commercial digital systems built to capture, qualify, and convert high-value opportunities. From digital presence to commercial control.',
  alternates: {
    canonical: '/en',
    languages: { 'es': '/' },
  },
};

export default function EnHomePage() {
  return (
    <SiteShell>
      <HomeContent locale="en" />
    </SiteShell>
  );
}
