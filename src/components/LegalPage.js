import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';

// Les pages légales utilisent toutes le même gabarit : on centralise ici la
// génération du metadata afin qu'il reste identique à celui de la page rendue.
export function legalMetadata({ title, description, path }) {
  return pageMetadata({ title, description, path });
}

export default function LegalPage({ title, description, path, intro, sections }) {
  const items = Array.isArray(sections) ? sections : [];

  return (
    <main className="min-h-screen bg-gray-50 pb-20" data-page={path}>
      <header className="bg-gradient-to-r from-blue-950 to-red-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-white/80 hover:text-white mb-6 inline-block font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{title}</h1>
          {description ? (
            <p className="text-lg text-white/90 max-w-3xl">{description}</p>
          ) : null}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <article className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
          {intro ? (
            <p className="text-lg text-gray-700 leading-relaxed mb-10">{intro}</p>
          ) : null}

          <div className="space-y-10">
            {items.map((section, index) => (
              <section
                key={`${section.heading}-${index}`}
                aria-labelledby={`legal-section-${index}`}
              >
                <h2
                  id={`legal-section-${index}`}
                  className="text-2xl font-bold text-blue-950 mb-4"
                >
                  {section.heading}
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {(Array.isArray(section.paragraphs) ? section.paragraphs : []).map(
                    (paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph}</p>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>

          <nav
            aria-label="Autres pages légales"
            className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-blue-950"
          >
            <Link href="/mentions-legales" className="hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
              Mentions légales
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
              Confidentialité
            </Link>
            <Link href="/conditions-publicitaires" className="hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
              Conditions publicitaires
            </Link>
            <Link href="/contact" className="hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
              Contact
            </Link>
          </nav>
        </article>
      </div>
    </main>
  );
}
