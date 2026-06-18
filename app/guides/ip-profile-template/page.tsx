import type { Metadata } from 'next';
import GuidePageTemplate from '@/components/GuidePageTemplate';

export const metadata: Metadata = {
  title: 'IP Profile Template Pack | Canadian Surrogacy Options',
  description:
    'Build a profile surrogates actually want to match with. Fill-in-the-blank framework, annotated examples, and Word/PDF templates. $67.',
  alternates: {
    canonical: 'https://canadiansurrogacyoptions.com/guides/ip-profile-template',
  },
  openGraph: {
    title: 'IP Profile Template Pack — $67 PDF Guide',
    description:
      'Most IP profiles say the same things. This template gives you a framework to stand out—without overselling or oversharing.',
    url: 'https://canadiansurrogacyoptions.com/guides/ip-profile-template',
  },
};

export default function IPProfilePage() {
  const stripeLink = process.env.STRIPE_PROFILE_LINK || '#';

  return (
    <GuidePageTemplate
      stripeLink={stripeLink}
      guide={{
        title: 'IP Profile Template Pack',
        price: 67,
        badge: 'Used by 400+ IPs matching in Canada',
        hero: {
          headline: 'Build a profile surrogates actually want to match with',
          subheading:
            "Most IP profiles say the same things: 'we're warm, we love to travel, we'll keep in touch.' Surrogates read dozens of these. This template gives you a framework to stand out—without oversharing or underselling.",
        },
        included: [
          '3-part fill-in-the-blank profile framework: family story, values, vision for the journey',
          '"What surrogates actually read first"—annotated example profile with real commentary',
          'The most common mistakes that end a match before it starts',
          'Photo selection guide: what works, what reads as red flags',
          'Customizable Word + PDF templates ready to personalize',
        ],
        forWho: [
          "You're matched or close to it and need a strong first impression",
          "You've written a profile before and didn't get selected",
          "You're working without an agency and need a professional framework",
          "You're re-entering the matching process and want a completely fresh approach",
          "You want to understand what surrogates are actually looking for",
        ],
        outcomeBody:
          "After completing the template, you'll have a profile that reads like a real person—not a brochure. One that surrogates can connect with and agencies are proud to share. You'll also understand why your previous approach may not have landed, and exactly what to do differently.",
        testimonial: {
          quote:
            "I'd written three versions of our profile and nothing was clicking. The template helped me realize what was missing—it wasn't more information, it was the right story. We were matched within six weeks.",
          author: 'J. & S., matched in BC',
        },
      }}
    />
  );
}
