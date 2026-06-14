import type { Metadata } from 'next';
import QualifyQuiz from '@/components/QualifyQuiz';

export const metadata: Metadata = {
  title: 'Do I Qualify to Be a Surrogate in Canada?',
  description:
    'Find out if you qualify to become a surrogate in Canada. Answer 8 honest questions for a personalized result based on Canadian eligibility guidelines. About 3 minutes, no pressure.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/qualify' },
  openGraph: {
    title: 'Do I Qualify to Be a Surrogate in Canada? | Canadian Surrogacy Options',
    description:
      'Answer 8 honest questions and get a personalized result based on Canadian surrogacy eligibility guidelines.',
    url: 'https://canadiansurrogacyoptions.com/qualify',
  },
};

export default function QualifyPage() {
  return <QualifyQuiz />;
}
