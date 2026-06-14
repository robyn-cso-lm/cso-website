import type { Metadata } from 'next';
import WelcomePage from './WelcomePage';

export const metadata: Metadata = {
  title: 'Welcome | Canadian Surrogacy Options',
  description: "Canada's first surrogacy agency since 1992. Whether you're building your family or considering becoming a surrogate, we're here to help.",
  robots: { index: false, follow: false }, // landing page — keep out of organic results
};

export default function Welcome() {
  return <WelcomePage />;
}
