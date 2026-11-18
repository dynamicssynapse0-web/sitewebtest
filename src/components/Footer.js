import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white pt-16 pb-8 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Colonne 1 : Marque et Réseaux Sociaux */}
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
              L'œil du sport par Aubin Simo. Capturer l'intensité, l'émotion et la beauté brute des événements sportifs à travers mon objectif.
            </p>
            <div className="flex gap-4">
              
              {/* 👇 REMPLACE L'URL FACEBOOK ICI 👇 */}
              <a href="https://www.facebook.com/https:/www.facebook.com/share/1FJN57x6r5/" target="_blank" rel="noreferrer" className="bg-blue-900 hover:bg-blue-800 p-3 rounded-full transition-colors" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>

              {/* 👇 REMPLACE L'URL INSTAGRAM ICI 👇 */}
              <a href="https://www.instagram.com/https:/www.instagram.com/p/DfvH4JUxrGv/?knvt=MWUwaTlkMnlsYmVmNw==" target="_blank" rel="noreferrer" className="bg-pink-600 hover:bg-pink-500 p-3 rounded-full transition-colors" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>

              {/* 👇 REMPLACE LE NUMÉRO WHATSAPP ICI 👇 (format international sans le +) */}
              <a href="https://wa.me/237676978878" target="_blank" rel="noreferrer" className="bg-green-600 hover:bg-green-500 p-3 rounded-full transition-colors" aria-label="WhatsApp">
                <FaWhatsapp size={20} />
              </a>

            </div>
          </div>

          {/* Colonne 2 : Navigation rapide */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-blue-800 pb-2 inline-block">Navigation</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/" className="hover:text-red-400 transition-colors">Accueil</Link></li>
              <li><Link href="/evenements" className="hover:text-red-400 transition-colors">Événements</Link></li>
              <li><Link href="/sports" className="hover:text-red-400 transition-colors">Sports</Link></li>
              <li><Link href="/galerie" className="hover:text-red-400 transition-colors">Galerie</Link></li>
              <li><Link href="/a-propos" className="hover:text-red-400 transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-red-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Coordonnées */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b border-blue-800 pb-2 inline-block">Contact</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0" size={18} />
                <span>Terminus Bonamoussadi<br />Douala, Cameroun</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-red-500 shrink-0" size={18} />
                <span>+237 676 978 878</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-red-500 shrink-0" size={18} />
                <a href="mailto:synapsesdynamics@gmail.com" className="hover:text-red-400 transition-colors">
                  synapsesdynamics@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation et Copyright */}
        <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Bilderfassung par Aubin Simo. Tous droits réservés.
          </p>
          <p className="text-sm text-gray-400">
            Conçu avec passion 📸
          </p>
        </div>
      </div>
    </footer>
  );
}