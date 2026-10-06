import type { Metadata } from 'next';
import ThankYou from './ThankYou';

export const metadata: Metadata = {
  title: 'Application received',
  robots: { index: false, follow: false },
};

export default function SurrogateThankYouPage() {
  return <ThankYou />;
}
