import type { Metadata } from 'next';
import GuidePageTemplate from '@/components/GuidePageTemplate';

export const metadata: Metadata = {
  title: 'Is Surrogacy Right For Me? | Canadian Surrogacy Options',
  description:
    'The honest guide to Canadian surrogacy costs, timelines, and legal realities. Especially useful for intended parents in the US, UK, and abroad who are considering Canada.',
  alternates: {
    canonical: 'https://canadiansurrogacyoptions.com/guides/is-surrogacy-right',
  },
  openGraph: {
    title: 'Is Surrogacy Right For Me? - $27 PDF Guide',
    description:
      'Real costs, real timelines, no sales pitch. Know if Canadian surrogacy is feasible for you before you call anyone.',
    url: 'https://canadiansurrogacyoptions.com/guides/is-surrogacy-right',
  },
};

export default function IsRightPage() {
  const stripeLink = process.env.STRIPE_STARTER_LINK || '#';

  return (
    <GuidePageTemplate
      stripeLink={stripeLink}
      promoBanner="For intended parents in Canada, the US, the UK, and abroad who are considering a Canadian journey"
      guide={{
        title: 'Is Surrogacy Right For Me?',
        price: 27,
        badge: 'Downloaded by 1,200+ intended parents',
        hero: {
          headline: 'Know if Canadian surrogacy is actually feasible for you',
          subheading:
            "If you're in Canada, the US, the UK, or elsewhere and considering a Canadian journey, this is the guide that helps you stop guessing. Real costs, realistic timelines, legal realities, and what international intended parents need to think through before they spend a dollar on the wrong next step.",
        },
        included: [
          'Real cost breakdown ($60K-$150K+), broken down line by line',
          'Month-by-month timeline from matching to birth',
          "Legal landscape by province and what international intended parents need to clarify early",
          'Red flags to watch for in agency contracts and sales language',
          'Budget tracker worksheet you can actually use before your first call',
        ],
        forWho: [
          "Exploring surrogacy but not ready to talk to an agency yet",
          "Living outside Canada and considering a Canadian surrogacy journey",
          "Comparing agencies and want a baseline before any sales calls",
          "You've been quoted prices that feel off and want independent context",
          'You want honest information without the pressure',
        ],
        outcomeBody:
          "After reading, you'll know whether Canadian surrogacy is financially and practically feasible for your situation, what the real cost range is, how long the process typically takes, what extra considerations apply if you live abroad, and which questions separate good agencies from great ones.",
        testimonial: {
          quote:
            "I'd been avoiding calls with agencies because I didn't want to be sold to. This guide let me get the real picture first. When I finally called CSO, I already knew the right questions to ask.",
          author: 'M.T., intended parent, Ontario',
        },
      }}
    />
  );
}
