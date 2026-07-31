'use strict';
/*
 * Toponymes de la géographie physique : mers et océans, côtes touristiques,
 * îles, massifs montagneux, sommets remarquables et étiquettes de fleuves.
 * Coordonnées [lat, lng] choisies pour un affichage lisible sur la carte.
 */
const GEO_LABELS = {
  mers: [
    { n: 'Mer du Nord', ll: [51.45, 2.55] },
    { n: 'Manche', ll: [49.95, -2.4] },
    { n: "Mer d'Iroise", ll: [48.3, -5.05] },
    { n: 'Océan Atlantique', ll: [46.6, -5.2] },
    { n: 'Golfe de Gascogne', ll: [44.7, -3.1] },
    { n: 'Mer Méditerranée', ll: [42.1, 5.6] },
    { n: 'Golfe du Lion', ll: [42.95, 3.95] },
    { n: 'Mer Ligure', ll: [43.35, 8.15] },
    { n: 'Mer Tyrrhénienne', ll: [41.7, 9.95] }
  ],
  cotes: [
    { n: "Côte d'Opale", ll: [50.72, 1.65] },
    { n: "Côte d'Albâtre", ll: [49.78, 0.55] },
    { n: 'Côte Fleurie', ll: [49.34, 0.02] },
    { n: 'Côte de Nacre', ll: [49.35, -0.45] },
    { n: "Côte d'Émeraude", ll: [48.68, -2.1] },
    { n: 'Côte de Granit Rose', ll: [48.85, -3.5] },
    { n: 'Côte des Abers', ll: [48.62, -4.6] },
    { n: 'Côte de Cornouaille', ll: [47.9, -4.35] },
    { n: 'Côte Sauvage', ll: [47.5, -3.15] },
    { n: "Côte d'Amour", ll: [47.27, -2.45] },
    { n: 'Côte de Jade', ll: [47.12, -2.2] },
    { n: 'Côte de Lumière', ll: [46.55, -1.9] },
    { n: 'Côte de Beauté', ll: [45.62, -1.1] },
    { n: "Côte d'Argent", ll: [44.3, -1.35] },
    { n: 'Côte Basque', ll: [43.45, -1.65] },
    { n: 'Côte Vermeille', ll: [42.5, 3.15] },
    { n: "Côte d'Améthyste", ll: [43.25, 3.4] },
    { n: 'Côte Bleue', ll: [43.34, 5.1] },
    { n: "Côte d'Azur", ll: [43.35, 6.85] }
  ],
  iles: [
    { n: "Île d'Ouessant", ll: [48.46, -5.09] },
    { n: 'Île de Sein', ll: [48.04, -4.85] },
    { n: 'Île de Batz', ll: [48.75, -4.01] },
    { n: 'Île de Bréhat', ll: [48.85, -3.0] },
    { n: 'Archipel des Glénan', ll: [47.72, -3.99] },
    { n: 'Île de Groix', ll: [47.64, -3.46] },
    { n: 'Belle-Île-en-Mer', ll: [47.33, -3.19] },
    { n: 'Île de Noirmoutier', ll: [47.0, -2.25] },
    { n: "Île d'Yeu", ll: [46.71, -2.35] },
    { n: 'Île de Ré', ll: [46.2, -1.43] },
    { n: "Île d'Aix", ll: [46.02, -1.17] },
    { n: "Île d'Oléron", ll: [45.93, -1.28] },
    { n: "Îles d'Hyères", ll: [42.99, 6.25] }
  ],
  massifs: [
    { n: 'Alpes', ll: [45.05, 6.5] },
    { n: 'Pyrénées', ll: [42.85, 0.6] },
    { n: 'Massif central', ll: [45.1, 2.95] },
    { n: 'Jura', ll: [46.65, 5.95] },
    { n: 'Vosges', ll: [48.1, 6.95] },
    { n: 'Morvan', ll: [47.2, 4.1] },
    { n: 'Massif armoricain', ll: [48.25, -2.9] }
  ],
  sommets: [
    { n: 'Mont Blanc', alt: 4806, ll: [45.8326, 6.8652] },
    { n: 'Barre des Écrins', alt: 4102, ll: [44.9237, 6.36] },
    { n: 'Mont Ventoux', alt: 1910, ll: [44.174, 5.279] },
    { n: 'Vignemale', alt: 3298, ll: [42.774, -0.147] },
    { n: 'Canigou', alt: 2784, ll: [42.519, 2.457] },
    { n: 'Monte Cinto', alt: 2706, ll: [42.379, 8.941] },
    { n: 'Puy de Sancy', alt: 1885, ll: [45.528, 2.815] },
    { n: 'Puy de Dôme', alt: 1465, ll: [45.772, 2.964] },
    { n: 'Grand Ballon', alt: 1424, ll: [47.901, 7.099] },
    { n: 'Crêt de la Neige', alt: 1720, ll: [46.27, 5.94] }
  ],
  /* étiquettes permanentes des cinq grands fleuves */
  fleuves: [
    { n: 'Loire', ll: [47.27, -0.35] },
    { n: 'Seine', ll: [49.3, 0.95] },
    { n: 'Garonne', ll: [44.35, 0.25] },
    { n: 'Rhône', ll: [44.75, 4.82] },
    { n: 'Rhin', ll: [48.55, 7.95] }
  ]
};
