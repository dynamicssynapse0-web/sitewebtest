import { Inter } from 'next/font/google';
import './globals.css';
import Analytics from '@/components/Analytics';
import Footer from '@/components/Footer';
import ImageProtection from '@/components/ImageProtection';
import Navbar from '@/components/Navbar';
import PartnerStrip from '@/components/PartnerStrip';
import { getActiveSportDisciplines } from '@/lib/categoriesSport';
import { getAllInternationalCompetitions } from '@/lib/internationalCompetitions';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  DEFAULT_OG_IMAGE,
} from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

const siteTitle = `${SITE_NAME} | Aubin Simo - Photographe Sportif`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: siteTitle, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  icons: {
    icon: { url: '/images/mon-logo.png', type: 'image/png' },
    shortcut: { url: '/images/mon-logo.png', type: 'image/png' },
    apple: { url: '/images/mon-logo.png', type: 'image/png' },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: siteTitle,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: 'Photographie sportive par Aubin Simo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }) {
  const [sportsMenu, competitionsMenu] = await Promise.all([
    getActiveSportDisciplines(),
    getAllInternationalCompetitions(),
  ]);

  return (
    <html lang="fr">
      <body className={inter.className}>
        <Analytics />
        <ImageProtection />
        <Navbar
          sportsMenu={sportsMenu}
          competitionsMenu={competitionsMenu}
        />
        {children}
        <PartnerStrip />
        <Footer />
      </body>
    </html>
  );
}