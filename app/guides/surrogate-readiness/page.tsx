import type { Metadata } from 'next';
import GuidePageTemplate from '@/components/GuidePageTemplate';

export const metadata: Metadata = {
  title: 'Surrogate Readiness Guide | Canadian Surrogacy Options',
  description:
    "Find out what you're really getting into before you commit. The honest guide to surrogacy from someone who's seen it from every side. Free right now with code SURROGACY.",
  alternates: {
    canonical: 'https://canadiansurrogacyoptions.com/guides/surrogate-readiness',
  },
  openGraph: {
    title: 'Surrogate Readiness Guide | Free Right Now',
    description:
      "Surrogacy is one of the most meaningful things you'll ever do. This guide gives you the honest version, so you can decide with clarity.",
    url: 'https://canadiansurrogacyoptions.com/guides/surrogate-readiness',
  },
};

export default function SurrogateReadinessPage() {
  const stripeLink = process.env.STRIPE_SURROGATE_LINK || '#';

  return (
    <GuidePageTemplate
      stripeLink={stripeLink}
      fallbackHref="/surrogates"
      fallbackLabel="Get the Free Guide"
      fallbackNote="Free right now on our surrogate page."
      promoBanner="Free right now with code SURROGACY"
      guide={{
        title: 'Surrogate Readiness Guide',
        price: 47,
        badge: 'Read by 800+ women considering surrogacy',
        hero: {
          headline: "Find out what you're really getting into before you commit",
          subheading:
            "Surrogacy is one of the most meaningful things you'll ever do. It's also more complex than most agencies tell you upfront. This guide gives you the honest version, from someone who's seen it from every side for 30 years.",
        },
        included: [
          "What surrogacy is actually like at each stage, not the highlight reel",
          "Medical and legal requirements most women don't know about until they're already in the process",
          'How to evaluate and compare agencies and what separates a good one from a great one',
          'Emotional readiness checklist: the questions worth sitting with before you decide',
          'Partner and family conversation guide for the hard discussions',
        ],
        forWho: [
          "You're seriously considering surrogacy and want to understand what you're committing to",
          "You've had an initial call with an agency and have more questions than answers",
          'Your partner or family has concerns you want to address thoughtfully',
          'You want to choose the right agency, not just any agency',
          'You want one trustworthy resource before the sales calls begin',
        ],
        outcomeBody:
          "After reading, you'll know whether now is the right time for your surrogacy journey, what to look for in an agency, what questions to ask in your first meeting, and how to have the conversations with the people closest to you.",
        testimonial: {
          quote:
            "I almost signed with a different agency until I read this. There were three things in the agency checklist I'd never thought to ask. Turns out, CSO was the only one that passed.",
          author: 'K.D., surrogate, Alberta',
        },
      }}
    />
  );
}
