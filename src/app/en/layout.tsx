import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lumapremium.com'
  ),
  title: {
    default: 'Luma Premium | Commercial Digital Architecture',
    template: '%s | Luma Premium',
  },
  description:
    'Commercial digital systems for premium businesses that need to capture, respond, organize, and convert opportunities with authority, speed, and control.',
  openGraph: {
    title: 'Luma Premium | Commercial Digital Architecture',
    description:
      'We do not sell isolated websites. We design connected commercial infrastructure.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
