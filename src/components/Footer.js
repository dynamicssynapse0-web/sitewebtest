import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { navigationLinks } from '@/lib/navigation';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white pt-16 pb-8 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          <div>
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="bg-red-600 text-white p-2 rounded-full group-hover:bg-red-500 transition">
                <span className="text-xl">📸</span>
              </div>
              <div>
                <h2 className="font-bold text-2xl leading-tight tracking-wide">Bilderfassung</h2>
                <p className="text-[10px] text-gray-300 uppercase tracking-widest">Par Aubin Simo</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              L&apos;œil du sport par Aubin Simo. Je capture l&apos;intensité.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/share/1FJN57x6r5/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-900 hover:bg-blue-800 p-3 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/p/DfvH4JUxrGv/?knvt=MWUwaTlkMnlsYmVmNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 hover:bg-pink-500 p-3 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://wa.me/237676978878"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-500 p-3 rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-blue-800 pb-2 inline-block">Navigation</h3>
            <ul className="space-y-3 text-gray-300">
              {navigationLinks.map((lien) => (
                <li key={lien.href}>
                  <Link href={lien.href} className="hover:text-red-400 transition-colors">
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-blue-800 pb-2 inline-block">Contact</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0" size={18} />
                <span>Terminus Bonamoussadi, Douala, Cameroun</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-red-500 shrink-0" size={18} />
                <a href="tel:+237676978878" className="hover:text-red-400 transition-colors">
                  +237 676 978 878
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="text-green-500 shrink-0" size={18} />
                <a
                  href="https://wa.me/237676978878"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-red-500 shrink-0" size={18} />
                <a href="mailto:bilderfassung@gmail.com" className="hover:text-red-400 transition-colors">
                  bilderfassung@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © Aubin Simo / Bilderfassung® | EMG | Tous droits réservés .
          </p>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <Link
              href="/admin"
              rel="nofollow"
              className="text-[11px] text-gray-500 transition hover:text-gray-300"
            >
              Admin
            </Link>
            <p className="text-sm text-gray-400">
              Conçu avec passion 📸
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
