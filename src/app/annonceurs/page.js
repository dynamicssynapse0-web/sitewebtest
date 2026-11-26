import Link from 'next/link';
import AnnonceurForm from './AnnonceurForm';
import { getAudienceStats } from '@/lib/analytics';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = pageMetadata({
  title: 'Annonceurs & partenaires',
  description:
    'Découvrez les formats publicitaires et le kit média de Bilderfassung – L’œil du sport, photographe sportif au Cameroun.',
  path: '/annonceurs',
});

const POURQUOI = [
  {
    titre: 'Une audience sportive locale',
    texte:
      'Parlez à des lecteurs passionnés de sport au Cameroun : football, basketball, athlétisme et toutes les disciplines couvertes par nos galeries.',
  },
  {
    titre: 'Des images fortes',
    texte:
      'Votre marque apparaît dans un environnement éditorial soigné, porté par des photographies qui capturent l’émotion et l’intensité du terrain.',
  },
  {
    titre: 'Des rendez-vous qui rassemblent',
    texte:
      'Des événements locaux aux compétitions internationales, y compris la CAN 2027, associant votre nom à des moments que la communauté sportive suit.',
  },
];

const FORMATS = [
  {
    titre: 'Bandeau accueil',
    texte:
      'Un emplacement visible dès l’arrivée sur la page d’accueil, avec un lien vers votre site ou votre conversation WhatsApp.',
  },
  {
    titre: 'Carte sponsorisée dans le fil',
    texte:
      'Une carte clairement identifiée, intégrée au fil des actualités et des galeries pour rester au cœur de la lecture.',
  },
  {
    titre: 'Logos partenaires',
    texte:
      'Votre logo présenté aux côtés des autres partenaires dans un bloc dédié, avec un lien vers votre structure.',
  },
  {
    titre: 'Sponsor d’événement ou de compétition',
    texte:
      'Un partenariat associé à une couverture photo précise, dans le respect des droits à l’image et des modalités convenues par écrit.',
  },
];

const TARIFS = [
  { offre: 'Partenaire', tarif: '50 000 – 100 000 FCFA / mois' },
  { offre: 'Sponsor de rubrique', tarif: '150 000 – 250 000 FCFA / mois' },
  { offre: 'Sponsor d’événement', tarif: '75 000 – 150 000 FCFA / événement' },
  { offre: 'Pack CAN 2027', tarif: 'Sur devis' },
];

export default async function Annonceurs() {
  const { events, competitions, sports, photos, pageviews } = await getAudienceStats();

  const formater = (nombre) => new Intl.NumberFormat('fr-FR').format(nombre);
  const chiffres = [
    { label: 'Événements publiés', valeur: events },
    { label: 'Compétitions publiées', valeur: competitions },
    { label: 'Disciplines couvertes', valeur: sports },
    { label: 'Photos en ligne', valeur: photos },
    { label: 'Pages vues (30 jours)', valeur: pageviews },
  ].filter(({ valeur }) => Number(valeur) > 0);

  const whatsappUrl = `https://wa.me/237676978878?text=${encodeURIComponent(
    "Bonjour, je souhaite discuter d'un partenariat publicitaire avec Bilderfassung – L'œil du sport.",
  )}`;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gradient-to-r from-blue-950 to-red-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-white/80 hover:text-white mb-6 inline-block font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            ← Retour à l&apos;accueil
          </Link>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/80 mb-4">
            Annonceurs &amp; partenaires
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 max-w-4xl">
            Faites connaître votre marque au cœur du sport camerounais
          </h1>
          <p className="text-lg text-white/90 max-w-3xl mb-8">
            Bilderfassung – L&apos;œil du sport accompagne les marques qui souhaitent s&apos;associer
            aux images, aux événements et aux histoires du sport camerounais.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-white text-blue-950 font-bold py-3 px-8 transition hover:bg-gray-100 shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Écrire sur WhatsApp
            </a>
            <Link
              href="#demande"
              className="inline-block rounded-full border-2 border-white text-white font-bold py-3 px-8 transition hover:bg-white hover:text-blue-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </header>

      <section aria-labelledby="chiffres-title" className="max-w-7xl mx-auto px-4 py-12">
        <h2 id="chiffres-title" className="text-3xl font-bold text-blue-950 mb-3">
          Des chiffres vérifiables
        </h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Ces indicateurs sont calculés à partir du contenu réellement publié et de la fréquentation
          mesurée sur le site. Aucun chiffre n&apos;est estimé.
        </p>

        {chiffres.length === 0 ? (
          <p className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-gray-600">
            Les indicateurs de fréquentation seront affichés dès que des données seront disponibles.
          </p>
        ) : (
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {chiffres.map((chiffre) => (
              <div
                key={chiffre.label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <dt className="text-sm font-semibold text-gray-600">{chiffre.label}</dt>
                <dd className="mt-2 text-3xl font-extrabold text-blue-950">
                  {formater(chiffre.valeur)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section aria-labelledby="pourquoi-title" className="max-w-7xl mx-auto px-4 py-12">
        <h2 id="pourquoi-title" className="text-3xl font-bold text-blue-950 mb-8">
          Pourquoi nous accompagner
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POURQUOI.map((item) => (
            <article key={item.titre} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-blue-950 mb-3">{item.titre}</h3>
              <p className="text-gray-600 leading-relaxed">{item.texte}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="formats-title" className="max-w-7xl mx-auto px-4 py-12">
        <h2 id="formats-title" className="text-3xl font-bold text-blue-950 mb-3">
          Les formats disponibles
        </h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Chaque annonce est signalée par la mention « Publicité » et s&apos;intègre dans la ligne
          éditoriale du site.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FORMATS.map((format) => (
            <article key={format.titre} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-blue-950 mb-3">{format.titre}</h3>
              <p className="text-gray-600 leading-relaxed">{format.texte}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="tarifs-title" className="max-w-7xl mx-auto px-4 py-12">
        <h2 id="tarifs-title" className="text-3xl font-bold text-blue-950 mb-3">
          Tarifs indicatifs
        </h2>
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm border border-gray-100">
          <table className="min-w-full text-left text-sm md:text-base">
            <caption className="sr-only">Tarifs indicatifs des partenariats publicitaires</caption>
            <thead className="bg-blue-950 text-white">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Formule</th>
                <th scope="col" className="px-6 py-4 font-semibold">Tarif indicatif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TARIFS.map((tarif) => (
                <tr key={tarif.offre}>
                  <th scope="row" className="px-6 py-4 font-semibold text-gray-900">
                    {tarif.offre}
                  </th>
                  <td className="px-6 py-4 text-gray-700">{tarif.tarif}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-gray-600">
          Ces montants sont donnés à titre indicatif. Un devis précis, adapté à votre format et à la
          durée de diffusion, vous sera envoyé par email ou par WhatsApp.
        </p>
      </section>

      <section id="demande" aria-labelledby="demande-title" className="scroll-mt-24 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 id="demande-title" className="text-3xl font-bold text-blue-950 mb-3">
            Envoyer une demande
          </h2>
          <p className="text-gray-600 max-w-3xl mb-8">
            Remplissez le formulaire ci-dessous ou contactez directement Aubin Simo pour définir
            votre partenariat.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnnonceurForm />
            </div>
            <aside aria-label="Contact direct" className="flex flex-col gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-lg text-blue-950 mb-2">Aubin Simo</h3>
                <p className="text-gray-600">Bilderfassung - L&apos;œil du sport</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-lg text-blue-950 mb-2">Email</h3>
                <a
                  href="mailto:bilderfassung@gmail.com"
                  className="text-red-600 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  bilderfassung@gmail.com
                </a>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-lg text-blue-950 mb-2">Téléphone et WhatsApp</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  <a
                    href="tel:+237676978878"
                    className="text-gray-700 font-semibold hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    +237 676 978 878
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-green-600 px-4 py-1 text-sm font-bold text-white hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-lg text-blue-950 mb-2">Adresse</h3>
                <address className="not-italic text-gray-600">
                  Terminus Bonamoussadi, Douala, Cameroun
                </address>
              </div>
              <Link
                href="/conditions-publicitaires"
                className="text-blue-950 font-semibold hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Lire les conditions publicitaires →
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
