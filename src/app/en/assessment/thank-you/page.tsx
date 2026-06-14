import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';

export const metadata: Metadata = {
  title: 'Request received',
  description: 'Your commercial assessment request has been received. Luma Premium will review your profile and reach out within 24–48 h.',
  robots: { index: false },
};

export default function EnThankYouPage() {
  return (
    <SiteShell>
      <section className="min-h-screen flex items-center justify-center px-6 py-32">
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="mx-auto w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
            <ShieldCheck className="w-10 h-10 text-amber-500" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Request received</h1>
            <p className="text-xl text-slate-400 font-light leading-relaxed">Your information has been received securely.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-left space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              Our team will review your commercial profile and assess the right system for your operation.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              We will be in touch within the next{' '}
              <strong className="text-white font-semibold">24–48 business hours</strong>{' '}
              to schedule your executive assessment.
            </p>
            <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-800 pt-4">
              If you need to speak sooner, reach us directly on WhatsApp.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://wa.me/18492122647?text=Hello%2C+I+already+submitted+my+assessment+request+at+Luma+Premium."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-950 px-6 py-4 rounded-sm font-semibold hover:bg-slate-200 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <Link href="/en/solutions" className="flex-1 flex items-center justify-center gap-2 border border-slate-700 text-slate-300 px-6 py-4 rounded-sm font-medium hover:bg-slate-900 transition-colors text-sm">
              View solutions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Link href="/en" className="block text-xs text-slate-600 hover:text-slate-400 transition-colors">Back to home</Link>
        </div>
      </section>
    </SiteShell>
  );
}
