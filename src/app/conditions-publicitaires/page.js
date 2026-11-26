import LegalPage, { legalMetadata } from '@/components/LegalPage';

const page = {
  title: 'Conditions publicitaires',
  description:
    'Conditions d’acceptation, de diffusion et de retrait des publicités sur le site Bilderfassung – L’œil du sport.',
  path: '/conditions-publicitaires',
  intro:
    'Les présentes conditions fixent le cadre dans lequel Bilderfassung – L’œil du sport accepte des annonces publicitaires et des partenariats sur le site https://bilderfassung.com.',
  sections: [
    {
      heading: 'Identification des publicités',
      paragraphs: [
        'Tout emplacement publicitaire diffusé sur le site est clairement identifié par la mention « Publicité ». Cette mention distingue les annonces des contenus éditoriaux et des photographies publiés par Aubin Simo.',
      ],
    },
    {
      heading: 'Formats, durée et tarifs',
      paragraphs: [
        'Les formats proposés, la durée de diffusion, les emplacements et les tarifs sont définis au cas par cas dans un accord écrit entre l’annonceur et Aubin Simo. Aucune diffusion ne commence avant cet accord et la validation des éléments fournis.',
        'Les tarifs indicatifs présentés sur la page /annonceurs ne constituent pas une offre ferme : un devis personnalisé est envoyé par email ou par WhatsApp selon le format et la durée retenus.',
      ],
    },
    {
      heading: 'Contenus acceptés',
      paragraphs: [
        'Les annonces doivent être licites, véridiques et non trompeuses. Elles ne doivent pas porter atteinte aux droits de tiers, ni promouvoir des produits ou des services interdits par la législation en vigueur au Cameroun.',
        'L’annonceur est responsable des informations, des marques et des visuels qu’il transmet. Il garantit qu’il dispose des autorisations nécessaires pour leur utilisation.',
      ],
    },
    {
      heading: 'Refus et retrait d’une annonce',
      paragraphs: [
        'Aubin Simo se réserve le droit de refuser une annonce ou de la retirer, sans préjudice des sommes déjà acquittées pour une période de diffusion non encore écoulée, notamment en cas de contenu illicite, trompeur ou contraire aux présentes conditions.',
        'Un annonceur peut demander le retrait de son annonce en écrivant à bilderfassung@gmail.com ; les modalités de remplacement ou de remboursement sont alors précisées par écrit.',
      ],
    },
    {
      heading: 'Données personnelles',
      paragraphs: [
        'Aucune donnée personnelle n’est vendue. Les informations transmises dans le cadre d’une demande publicitaire sont utilisées uniquement pour préparer un devis, diffuser l’annonce convenue et assurer le suivi du partenariat.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        'Pour toute demande publicitaire ou question sur ces conditions, écrivez à bilderfassung@gmail.com, appelez le +237 676 978 878 ou utilisez le formulaire disponible sur la page /annonceurs.',
      ],
    },
  ],
};

export const metadata = legalMetadata(page);

export default function ConditionsPublicitaires() {
  return <LegalPage {...page} />;
}
