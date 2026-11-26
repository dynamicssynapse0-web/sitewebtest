'use client';

import { useState } from 'react';

const CAMPAGNES = [
  'Bandeau accueil',
  'Carte sponsorisée',
  'Logos partenaires',
  'Sponsor d’événement',
  'Pack CAN 2027',
  'À définir',
];

const BUDGETS = [
  'moins de 100 000 FCFA',
  '100 000 – 250 000 FCFA',
  '250 000 – 500 000 FCFA',
  'plus de 500 000 FCFA',
  'À définir',
];

export default function AnnonceurForm() {
  const [statut, setStatut] = useState('pret');

  return (
    <section
      aria-labelledby="annonceur-form-title"
      className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <h2 id="annonceur-form-title" className="text-2xl font-bold text-blue-950 mb-2">
        Demande publicitaire
      </h2>
      <p className="text-gray-600 mb-6">
        Décrivez votre projet : un devis personnalisé vous sera envoyé par email ou par WhatsApp.
      </p>

      <form
        action="https://formspree.io/f/xgakkrle"
        method="POST"
        autoComplete="off"
        onSubmit={() => setStatut('envoi')}
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="_subject" value="Demande publicitaire - Bilderfassung" />
        <input
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          hidden
          aria-hidden="true"
        />

        <div>
          <label htmlFor="annonceur-nom" className="mb-1 block text-sm font-semibold text-gray-800">
            Nom
          </label>
          <input
            id="annonceur-nom"
            type="text"
            name="nom"
            placeholder="Votre nom"
            required
            aria-describedby="annonceur-statut"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="annonceur-societe" className="mb-1 block text-sm font-semibold text-gray-800">
            Société
          </label>
          <input
            id="annonceur-societe"
            type="text"
            name="societe"
            placeholder="Nom de votre structure"
            aria-describedby="annonceur-statut"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="annonceur-email" className="mb-1 block text-sm font-semibold text-gray-800">
            Email
          </label>
          <input
            id="annonceur-email"
            type="email"
            name="email"
            placeholder="vous@exemple.com"
            required
            aria-describedby="annonceur-statut"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="annonceur-telephone" className="mb-1 block text-sm font-semibold text-gray-800">
            Téléphone / WhatsApp
          </label>
          <input
            id="annonceur-telephone"
            type="tel"
            name="telephone"
            placeholder="+237 6XX XXX XXX"
            aria-describedby="annonceur-statut"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="annonceur-campagne" className="mb-1 block text-sm font-semibold text-gray-800">
            Type de campagne
          </label>
          <select
            id="annonceur-campagne"
            name="type_de_campagne"
            required
            defaultValue=""
            aria-describedby="annonceur-statut"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Sélectionnez un format</option>
            {CAMPAGNES.map((campagne) => (
              <option key={campagne} value={campagne}>{campagne}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="annonceur-budget" className="mb-1 block text-sm font-semibold text-gray-800">
            Budget indicatif
          </label>
          <select
            id="annonceur-budget"
            name="budget_indicatif"
            required
            defaultValue=""
            aria-describedby="annonceur-statut"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Sélectionnez une fourchette</option>
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>{budget}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="annonceur-message" className="mb-1 block text-sm font-semibold text-gray-800">
            Message
          </label>
          <textarea
            id="annonceur-message"
            name="message"
            placeholder="Parlez-moi de votre campagne, de vos objectifs et de vos échéances…"
            rows="5"
            required
            minLength={10}
            aria-describedby="annonceur-statut"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={statut === 'envoi'}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 rounded-lg transition shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          {statut === 'envoi' ? 'Envoi en cours…' : 'Envoyer ma demande'}
        </button>

        <p
          id="annonceur-statut"
          role="status"
          aria-live="polite"
          className="min-h-5 text-sm text-green-700"
        >
          {statut === 'envoi'
            ? 'Envoi de votre demande en cours…'
            : 'Votre demande est prête à être envoyée.'}
        </p>
        <p className="text-xs text-gray-500">
          En cas d’échec, Formspree affichera une page d’erreur dédiée. Vous pouvez aussi utiliser
          les liens directs ci-contre.
        </p>
      </form>
    </section>
  );
}
