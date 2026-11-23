import { getRemoteVitrine } from './supabase/content';

const momentsFortsLocaux = [
  {
    id: 'moment-acceuil',
    title: 'Joueur en pleine action',
    subtitle: '',
    order: 1,
    image: '/images/aubin-simo-acceuil.jpg',
    alt: 'Joueur en pleine action',
    legend: 'Joueur en pleine action',
    credit: 'Aubin Simo',
    source: 'local',
  },
  {
    id: 'moment-getimages',
    title: 'Moment fort d’un événement sportif',
    subtitle: '',
    order: 2,
    image: '/images/aubin-simo-getimages.jpg',
    alt: 'Moment fort d’un événement sportif',
    legend: 'Moment fort d’un événement sportif',
    credit: 'Aubin Simo',
    source: 'local',
  },
  {
    id: 'moment-basketball',
    title: 'Action de basketball pendant un match',
    subtitle: '',
    order: 3,
    image: '/images/aubin-basketball-fiba.jpg',
    alt: 'Action de basketball pendant un match',
    legend: 'Action de basketball pendant un match',
    credit: 'Aubin Simo',
    source: 'local',
  },
];

const portraitsExclusifsLocaux = [
  {
    id: 'portrait-timba',
    title: 'TIMBA',
    subtitle: 'Attaquant',
    order: 1,
    image: '/images/aubin-simo-player.jpg',
    alt: 'Portrait exclusif de TIMBA',
    legend: 'TIMBA',
    credit: 'Aubin Simo',
    source: 'local',
  },
  {
    id: 'portrait-manguele',
    title: 'MANGUELE',
    subtitle: 'Meneur',
    order: 2,
    image: '/images/aubin-simo-manguele.jpg',
    alt: 'Portrait exclusif de MANGUELE',
    legend: 'MANGUELE',
    credit: 'Aubin Simo',
    source: 'local',
  },
  {
    id: 'portrait-oloko-ede',
    title: 'JOSEPH OLOKO EDE',
    subtitle: 'Défenseur',
    order: 3,
    image: '/images/aubin-simo-photographe-football-RCA-BENIN.jpg.jpg',
    alt: 'Portrait exclusif de Joseph Oloko Ede',
    legend: 'JOSEPH OLOKO EDE',
    credit: 'Aubin Simo',
    source: 'local',
  },
];

const defaultsBySection = {
  moment_fort: momentsFortsLocaux,
  portrait_exclusif: portraitsExclusifsLocaux,
};

export async function getVitrineItems(section) {
  const local = defaultsBySection[section] || [];
  const remote = await getRemoteVitrine(section);

  return [...local, ...remote]
    .filter((item) => item.image)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

export async function getMomentsForts() {
  return getVitrineItems('moment_fort');
}

export async function getPortraitsExclusifs() {
  return getVitrineItems('portrait_exclusif');
}
