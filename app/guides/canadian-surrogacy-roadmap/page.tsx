import type { Metadata } from 'next';
import GuidePageTemplate from '@/components/GuidePageTemplate';

export const metadata: Metadata = {
  title: 'The Canadian Surrogacy Roadmap | Canadian Surrogacy Options',
  description:
    'Your complete step-by-step guide from first question to bringing baby home. 12-phase journey timeline, full budget tracker, legal deep-dive, surrogate match guide, and 4 fillable worksheets. $97.',
  alternates: {
    canonical: 'https://canadiansurrogacyoptions.com/guides/canadian-surrogacy-roadmap',
  },
  openGraph: {
    title: 'The Canadian Surrogacy Roadmap — $97 PDF Guide',
    description:
      'The most comprehensive guide to Canadian surrogacy that exists outside a lawyer\'s office. 12 phases mapped. Full budget tracker. Everything.',
    url: 'https://canadiansurrogacyoptions.com/guides/canadian-surrogacy-roadmap',
  },
};

export default function RoadmapPage() {
  const stripeLink = process.env.STRIPE_ROADMAP_LINK || '#';

  return (
    <GuidePageTemplate
      stripeLink={stripeLink}
      guide={{
        title: 'The Canadian Surrogacy Roadmap',
        price: 97,
        badge: 'Used by 600+ families navigating Canadian surrogacy',
        hero: {
          headline: 'Your complete guide from first question to bringing baby home',
          subheading:
            "This is the most comprehensive guide to Canadian surrogacy that exists outside a lawyer's office. 28 pages. 12 phases mapped with real timeframes. A budget tracker you can actually fill in. Everything you need to go into this with your eyes open.",
        },
        included: [
          '12-phase journey timeline—from choosing an agency to legal parentage after birth, with realistic timeframes for each phase',
          'Complete budget tracker: $40K–$140K broken down line by line across every cost category',
          'Province-by-province legal overview—including why Quebec is different and what international IPs need to know',
          'Surrogate match guide: what to look for, 20+ questions to ask, and what incompatible answers look like',
          'Legal agreement deep-dive: every clause that must be in your contract before transfer',
          'Clinic and medical guide: how screening works, what the transfer process looks like, what to expect',
          '4 fillable worksheets: surrogate interview notes, agency comparison, journey goals, budget planner',
        ],
        forWho: [
          "You've decided surrogacy is right for you and need a complete reference document for the full journey",
          "You're just starting and want to understand every phase before you commit to anything",
          "You're mid-journey and need reference material for the phase you're about to enter",
          "You're doing an independent journey and need the structure an agency would normally provide",
          "You want to understand what a good agency should actually be doing for you",
          "You're comparing your options and need a baseline before any sales calls",
        ],
        outcomeBody:
          "After reading, you'll have a complete map of your journey from first question to baby home. A budget you've actually built—not just estimated. The right questions for every meeting ahead of you. And a reference document you'll return to at every phase of a 2–4 year journey.",
        testimonial: {
          quote:
            "I went into our first agency call with this guide in front of me. I already knew what to ask, what was missing from their pitch, and what the real timeline looked like. It changed every conversation we had from that point on.",
          author: 'D. & A., now matched in Ontario',
        },
      }}
    />
  );
}
