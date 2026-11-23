'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [statut, setStatut] = useState('');

  return (
    <section
      aria-labelledby="contact-form-title"
      className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <h2 id="contact-form-title" className="text-2xl font-bold text-blue-900 mb-6">
        Envoyer un message
      </h2>

      <form
        action="https://formspree.io/f/xgakkrle"
        method="POST"
        onSubmit={() => setStatut('envoi')}
        className="flex flex-col gap-4"
      >
        <div>
          <label htmlFor="contact-nom" className="mb-1 block text-sm font-semibold text-gray-800">
            Votre nom
          </label>
          <input
            id="contact-nom"
            type="text"
            name="nom"
            autoComplete="name"
            placeholder="Votre nom"
            required
            aria-describedby="contact-statut"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm font-semibold text-gray-800">
            Votre email
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            required
            aria-describedby="contact-statut"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1 block text-sm font-semibold text-gray-800">
            Votre message
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Parlez-moi de votre projet…"
            rows="5"
            required
            minLength={10}
            aria-describedby="contact-statut"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={statut === 'envoi'}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 rounded-lg transition shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          {statut === 'envoi' ? 'Envoi en cours…' : 'Envoyer le message'}
        </button>

        <p
          id="contact-statut"
          role="status"
          aria-live="polite"
          className="min-h-5 text-sm text-green-700"
        >
          {statut === 'envoi'
            ? 'Envoi de votre message en cours…'
            : 'Votre message est prêt à être envoyé.'}
        </p>
        <p className="text-xs text-gray-500">
          En cas d’échec, Formspree affichera une page d’erreur dédiée. Vous pouvez aussi
          utiliser les liens directs ci-contre.
        </p>
      </form>
    </section>
  );
}
