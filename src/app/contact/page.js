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
      
      {/* En-tête avec la charte */}
      <div className="bg-gradient-to-r from-blue-900 to-red-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Contactez-moi</h1>
          <p className="text-lg text-white/90">Une question, un projet d&apos;événement ? Discutons-en.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Formulaire */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Envoyer un message</h2>
            
            {/* C'EST ICI QU'ON MET TON LIEN FORMSPREE */}
            <form 
              action="https://formspree.io/f/xgakkrle" 
              method="POST" 
              className="flex flex-col gap-4"
            >
              <input 
                type="text" 
                name="nom"
                placeholder="Votre nom" 
                required
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Votre email" 
                required
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <textarea 
                name="message"
                placeholder="Votre message" 
                rows="5" 
                required
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              
              <button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition shadow-md"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Infos de contact */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-blue-900 mb-2">📍 Localisation</h3>
              <p className="text-gray-600">Terminus Bonamoussadi<br />Douala, Cameroun</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-blue-900 mb-2">📧 Email</h3>
              <p className="text-gray-600">
                <a href="mailto:synapsesdynamics@gmail.com" className="hover:text-red-600 transition">synapsesdynamics@gmail.com</a>
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-blue-900 mb-2">📱 Téléphone</h3>
              <p className="text-gray-600">+237 676 978 878</p>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}