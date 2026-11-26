import LegalPage, { legalMetadata } from '@/components/LegalPage';

const page = {
  title: 'Mentions légales',
  description:
    'Informations sur l’éditeur, l’hébergement et la publication du site Bilderfassung – L’œil du sport.',
  path: '/mentions-legales',
  intro:
    'Les présentes mentions légales ont pour objet d’informer les visiteurs du site https://bilderfassung.com sur l’éditeur du service, son hébergement et les conditions générales d’utilisation du site.',
  sections: [
    {
      heading: 'Éditeur du site',
      paragraphs: [
        'Le site est édité par Bilderfassung – L’œil du sport, activité de photographie sportive exercée par Aubin Simo, dont le lieu d’activité est situé à Terminus Bonamoussadi, Douala, Cameroun.',
        'Pour toute question relative au site, à son contenu ou à une utilisation des photographies, vous pouvez écrire à bilderfassung@gmail.com ou appeler le +237 676 978 878.',
      ],
    },
    {
      heading: 'Directeur de la publication',
      paragraphs: [
        'Le directeur de la publication est Aubin Simo. Il veille à la mise à jour des informations publiées et répond aux demandes des lecteurs aux coordonnées indiquées ci-dessus.',
      ],
    },
    {
      heading: 'Hébergement',
      paragraphs: [
        'Le site est hébergé par un prestataire d’hébergement tiers. L’hébergeur assure la disponibilité technique du service ; il n’intervient ni dans la rédaction des contenus ni dans le traitement des demandes adressées à l’éditeur.',
        'Les coordonnées de l’hébergeur peuvent être communiquées sur simple demande adressée à bilderfassung@gmail.com.',
      ],
    },
    {
      heading: 'Propriété intellectuelle',
      paragraphs: [
        'L’ensemble des textes, photographies, graphismes et éléments visuels présents sur le site sont la propriété d’Aubin Simo ou de ses ayants droit. Toute reproduction, représentation ou exploitation, même partielle, nécessite une autorisation écrite préalable.',
        'Les noms, marques et signes distinctifs mentionnés sur le site restent la propriété de leurs titulaires respectifs.',
      ],
    },
    {
      heading: 'Liens hypertextes',
      paragraphs: [
        'Les liens proposés vers d’autres sites le sont à titre informatif. Bilderfassung n’exerce aucun contrôle sur le contenu de ces sites tiers et décline toute responsabilité quant à leur utilisation.',
      ],
    },
    {
      heading: 'Données personnelles',
      paragraphs: [
        'Le traitement des données personnelles collectées via le site est décrit dans la politique de confidentialité, accessible depuis le pied de page ou à l’adresse /politique-de-confidentialite.',
      ],
    },
    {
      heading: 'Droit applicable',
      paragraphs: [
        'Les présentes mentions légales sont soumises au droit camerounais. En cas de désaccord, les parties s’efforcent de trouver une solution amiable avant toute action.',
      ],
    },
  ],
};

export const metadata = legalMetadata(page);

export default function MentionsLegales() {
  return <LegalPage {...page} />;
}
