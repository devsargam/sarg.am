import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { ViewTransitions } from 'next-view-transitions';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = 'https://sarg.am';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Sargam Poudel',
    template: '%s | Sargam Poudel',
  },
  description: 'I build things - software engineer based in Bangalore, India',
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },
  openGraph: {
    title: 'Sargam Poudel',
    description: 'I build things - software engineer based in Bangalore, India',
    url: siteUrl,
    siteName: 'Sargam Poudel',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sargam Poudel',
    description: 'I build things - software engineer based in Bangalore, India',
    creator: '@sargampoudel',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className="bg-[var(--background)] text-[var(--foreground)]">
        <head>
          <link rel="alternate" type="application/rss+xml" title="Sargam Poudel's Blog" href="/feed.xml" />
        </head>
        <body className={inter.className}>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <main id="main-content" className="bg-[var(--background)] min-h-screen max-w-xl mx-auto px-5 py-8 md:py-16">
            {children}
            <SpeedInsights />
            <Analytics />
          </main>
          <Script id="clarity-script" strategy="afterInteractive">
            {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "nczs4rjeot");
            `}
          </Script>
          <Script id='ahrefs' src="https://analytics.ahrefs.com/analytics.js" data-key="KrVNPks4a/m70wrtIgrG/g" async></Script>
        </body>
      </html>
    </ViewTransitions>
  );
}
