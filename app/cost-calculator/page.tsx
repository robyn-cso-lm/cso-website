import type { Metadata } from 'next';
import CostCalculator from './CostCalculator';

export const metadata: Metadata = {
  title: 'Surrogacy Cost Calculator | Canadian Surrogacy Options',
  description:
    'Get a personalized estimate for your surrogacy journey in Canada or the United States. See itemized costs for all three surrogacy pathways — no email required.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/cost-calculator' },
  openGraph: {
    title: 'How Much Does Surrogacy Cost? | Canadian Surrogacy Options',
    description:
      'Use our free surrogacy cost calculator to get a transparent, pathway-by-pathway estimate tailored to your situation.',
    url: 'https://canadiansurrogacyoptions.com/cost-calculator',
    siteName: 'Canadian Surrogacy Options',
    type: 'website',
  },
};

export default function CostCalculatorPage() {
  return <CostCalculator />;
}
