import ContactForm from './ContactForm';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Contactez Aubin Simo pour couvrir votre événement sportif à Douala ou ailleurs au Cameroun.',
  path: '/contact',
});

export default function Contact() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-blue-900 to-red-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Contactez-moi</h1>
          <p className="text-lg text-white/90">
            Une question, un projet d&apos;événement ? Discutons-en.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ContactForm />

          <aside aria-label="Coordonnées" className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg text-blue-900 mb-2">📍 Localisation</h2>
              <address className="not-italic text-gray-600">
                Terminus Bonamoussadi
                <br />
                Douala, Cameroun
              </address>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg text-blue-900 mb-2">📧 Email</h2>
              <a
                href="mailto:synapsesdynamics@gmail.com"
                className="text-red-600 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                synapsesdynamics@gmail.com
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg text-blue-900 mb-2">📱 Téléphone</h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:+237676978878"
                  className="text-gray-700 font-semibold hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  +237 676 978 878
                </a>
                <a
                  href="https://wa.me/237676978878"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-green-600 px-4 py-1 text-sm font-bold text-white hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
