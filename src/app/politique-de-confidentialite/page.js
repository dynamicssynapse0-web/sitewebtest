import LegalPage, { legalMetadata } from '@/components/LegalPage';

const page = {
  title: 'Politique de confidentialité',
  description:
    'Comment Bilderfassung traite les données personnelles : mesure d’audience interne, formulaires, liens WhatsApp et droits de contact.',
  path: '/politique-de-confidentialite',
  intro:
    'Bilderfassung – L’œil du sport attache de l’importance à la protection de vos données personnelles. Cette page explique quelles informations sont traitées lors de votre visite, pourquoi et comment nous contacter pour exercer vos droits.',
  sections: [
    {
      heading: 'Responsable du traitement',
      paragraphs: [
        'Les données sont traitées par Aubin Simo, photographe sportif, joignable à bilderfassung@gmail.com, au +237 676 978 878 ou à l’adresse Terminus Bonamoussadi, Douala, Cameroun.',
      ],
    },
    {
      heading: 'Compteur de pages vues',
      paragraphs: [
        'Le site utilise un compteur de pages vues interne, sans cookie ni script publicitaire tiers. Lors de la consultation d’une page, seuls son chemin (par exemple /galerie) et la date de la visite sont enregistrés. Les pages d’administration sont exclues de cette mesure.',
        'Afin d’éviter de gonfler les chiffres lors des rafraîchissements, une seule vue par page et par jour est comptée pour un même navigateur : cette information est conservée dans le stockage local (localStorage) de votre navigateur. Vous pouvez la supprimer à tout moment en effaçant les données de navigation du site.',
      ],
    },
    {
      heading: 'Formulaires de contact et d’annonceurs',
      paragraphs: [
        'Les formulaires de contact et de demande publicitaire sont envoyés via le service Formspree. Les informations que vous saisissez (nom, société le cas échéant, adresse email, téléphone et message) servent uniquement à vous répondre, à préparer un devis et à gérer la relation commerciale.',
        'Ces données ne sont pas vendues et ne sont pas transmises à des tiers à des fins publicitaires.',
      ],
    },
    {
      heading: 'Liens WhatsApp',
      paragraphs: [
        'Les boutons WhatsApp ouvrent une conversation avec Aubin Simo. Le texte préparé par le site, et le cas échéant l’image que vous décidez de joindre depuis votre navigateur, sont remis à WhatsApp : le site ne lit pas le contenu de votre messagerie. Vous restez libre d’envoyer ou non le message.',
      ],
    },
    {
      heading: 'Photographies et droits à l’image',
      paragraphs: [
        'Les photographies publiées sont protégées par le droit d’auteur et, le cas échéant, par les droits à l’image des personnes représentées. Leur utilisation nécessite une autorisation préalable. Les personnes qui souhaitent signaler une image, demander une rectification ou exercer leurs droits à l’image peuvent écrire à bilderfassung@gmail.com.',
      ],
    },
    {
      heading: 'Conservation des données',
      paragraphs: [
        'Les données sont conservées uniquement pendant la durée nécessaire à la réponse apportée et au suivi de la demande. Les enregistrements de pages vues sont utilisés à des fins statistiques agrégées pour le kit média.',
      ],
    },
    {
      heading: 'Vos droits et contact',
      paragraphs: [
        'Vous pouvez demander l’accès, la rectification ou la suppression des données personnelles vous concernant. Adressez votre demande par email à bilderfassung@gmail.com, par WhatsApp au +237 676 978 878 ou par courrier à Bilderfassung – Aubin Simo, Terminus Bonamoussadi, Douala, Cameroun.',
      ],
    },
  ],
};

export const metadata = legalMetadata(page);

export default function PolitiqueDeConfidentialite() {
  return <LegalPage {...page} />;
}
