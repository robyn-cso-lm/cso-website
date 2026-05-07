import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';

export const metadata: Metadata = {
  metadataBase: new URL('https://canadiansurrogacyoptions.com'),
  title: {
    default: 'Canadian Surrogacy Options | Canada\'s First Surrogacy Agency Since 1992',
    template: '%s | Canadian Surrogacy Options',
  },
  description: 'Canada\'s first surrogacy agency, founded in 1992. We\'ve helped over 2,500 families build their families through surrogacy. Book a free consultation with Robyn today.',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://canadiansurrogacyoptions.com',
    siteName: 'Canadian Surrogacy Options',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Canadian Surrogacy Options',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {GA_ID && process.env.NODE_ENV === 'production' && (<>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}</Script>
        </>)}
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-467681165" strategy="afterInteractive" />
        <Script id="google-ads-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-467681165');`}</Script>
        <Nav />
        <main>{children}</main>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  );
}
