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

// Google Tag IDs — fire unconditionally on every page
const GA4_ID  = 'G-G9L2PTW3ES';
const GTAG_ID = 'GT-5D93JGQ2';

// Meta Pixel ID
const META_PIXEL_ID = '1533454933710050';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ── Google Tag (GA4 + GT) ─────────────────────────────────────────── */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}');
            gtag('config', '${GTAG_ID}');
          `}
        </Script>

        {/* ── Meta / Facebook Pixel ─────────────────────────────────────────── */}
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  );
}
