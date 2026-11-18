import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bilderfassung | Aubin Simo - Photographe Sportif',
  description: "L'œil du sport par Aubin Simo. Découvrez mes photographies d'événements sportifs au Cameroun.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  );
}