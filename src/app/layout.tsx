import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { SiteLayout } from '@/components/layout/SiteLayout';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sabrinachandini.com'),
  title: {
    default: 'Sabrina Chandini — Builder, Storyteller, Entrepreneur',
    template: '%s | Sabrina Chandini',
  },
  description:
    'Builder, storyteller, entrepreneur. Always learning new AI tools. Inspired by people creating something new—startup founders or founding fathers.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sabrinachandini.com',
    siteName: 'Sabrina Chandini',
    title: 'Sabrina Chandini — Builder, Storyteller, Entrepreneur',
    description:
      'Builder, storyteller, entrepreneur. Always learning new AI tools. Inspired by people creating something new—startup founders or founding fathers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sabrina Chandini — Builder, Storyteller, Entrepreneur',
    description:
      'Builder, storyteller, entrepreneur. Always learning new AI tools. Inspired by people creating something new—startup founders or founding fathers.',
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
