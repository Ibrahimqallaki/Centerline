import { MachinePoint, Zone, Criticality } from './types';

export const MACHINE_POINTS: MachinePoint[] = [
  // 1. Inmatning
  {
    id: 'P-01',
    number: 1,
    name: 'Inmatningskedja (Huvud)',
    zone: Zone.INFEED,
    description: 'Positionering av medbringare för kartongintag.',
    targetValue: '15mm',
    tolerance: '+/- 1mm',
    measureMethod: 'Siko Räknare',
    criticality: Criticality.MEDIUM,
    imagePlaceholder: 'https://picsum.photos/400/300?random=1',
    coordinates: { x: 5, y: 50 },
    phaseAngle: 0,
    visibleOnMap: true
  },
  // 2. Separering
  {
    id: 'P-12',
    number: 12,
    name: 'Grupperingspaddel Timing',
    zone: Zone.SEPARATION,
    description: 'Tidpunkt då paddeln separerar 24-packet.',
    targetValue: '210°',
    tolerance: '+/- 2°',
    measureMethod: 'Digital Encoder',
    criticality: Criticality.HIGH,
    imagePlaceholder: 'https://picsum.photos/400/300?random=2',
    coordinates: { x: 20, y: 50 },
    phaseAngle: 210,
    visibleOnMap: true
  },
  // 3. Gejdrar (Guides)
  {
    id: 'P-15',
    number: 15,
    name: 'Sido-gejder Inlopp',
    zone: Zone.GUIDES,
    description: 'Breddinställning för inkommande produkt.',
    targetValue: '185mm',
    tolerance: '+/- 1mm',
    measureMethod: 'Linjal / Skala',
    criticality: Criticality.LOW,
    imagePlaceholder: 'https://picsum.photos/400/300?random=8',
    coordinates: { x: 30, y: 35 },
    phaseAngle: undefined,
    visibleOnMap: true
  },
  // 4. Kartongmatning
  {
    id: 'P-18',
    number: 18,
    name: 'Magasin Vakuumarm',
    zone: Zone.CARDBOARD,
    description: 'Vinkel för hämtning av platt kartong.',
    targetValue: '45°',
    tolerance: '+/- 2°',
    measureMethod: 'Gradskiva',
    criticality: Criticality.MEDIUM,
    imagePlaceholder: 'https://picsum.photos/400/300?random=9',
    coordinates: { x: 40, y: 70 },
    phaseAngle: 45,
    visibleOnMap: true
  },
  // 5. Formverktyg
  {
    id: 'P-24',
    number: 24,
    name: 'Formverktyg Höjd',
    zone: Zone.FORMING,
    description: 'Höjdinställning på det övre pressverktyget.',
    targetValue: '112.5mm',
    tolerance: '+/- 0.5mm',
    measureMethod: 'Siko (Röd)',
    criticality: Criticality.CRITICAL,
    imagePlaceholder: 'https://picsum.photos/400/300?random=3',
    coordinates: { x: 50, y: 30 },
    phaseAngle: undefined,
    visibleOnMap: true
  },
  {
    id: 'P-26',
    number: 26,
    name: 'Formarm Synkronisering',
    zone: Zone.FORMING,
    description: 'Vinkel då formarmen möter tråget. Risk för krasch om fel.',
    targetValue: '95°',
    tolerance: '+/- 1°',
    measureMethod: 'Gradskiva / Encoder',
    criticality: Criticality.CRITICAL,
    imagePlaceholder: 'https://picsum.photos/400/300?random=4',
    coordinates: { x: 55, y: 50 },
    phaseAngle: 95,
    visibleOnMap: true
  },
  // 6. Krympfilm Matning
  {
    id: 'P-32',
    number: 32,
    name: 'Filmkniv Utlösning',
    zone: Zone.SHRINK_FILM,
    description: 'Exakt punkt där kniven klipper filmen.',
    targetValue: '340°',
    tolerance: '+/- 5°',
    measureMethod: 'Elektronisk Kam',
    criticality: Criticality.HIGH,
    imagePlaceholder: 'https://picsum.photos/400/300?random=5',
    coordinates: { x: 70, y: 60 },
    phaseAngle: 340,
    visibleOnMap: true
  },
  {
    id: 'P-35',
    number: 35,
    name: 'Filmbana Spänning',
    zone: Zone.SHRINK_FILM,
    description: 'Dansvalsspänning för filmen.',
    targetValue: '3.5 Bar',
    tolerance: '+/- 0.2 Bar',
    measureMethod: 'Manometer',
    criticality: Criticality.LOW,
    imagePlaceholder: 'https://picsum.photos/400/300?random=6',
    coordinates: { x: 75, y: 20 },
    phaseAngle: undefined,
    visibleOnMap: true
  },
  // 7. Utmatning
  {
    id: 'P-48',
    number: 48,
    name: 'Utmatningsband Hastighet',
    zone: Zone.DISCHARGE,
    description: 'Differenshastighet mot ugnen.',
    targetValue: '+5%',
    tolerance: '+/- 1%',
    measureMethod: 'HMI',
    criticality: Criticality.MEDIUM,
    imagePlaceholder: 'https://picsum.photos/400/300?random=7',
    coordinates: { x: 90, y: 50 },
    phaseAngle: undefined,
    visibleOnMap: true
  }
];

export const ZONE_COLORS = {
  [Zone.INFEED]: 'text-blue-400 border-blue-400 bg-blue-900/20',
  [Zone.SEPARATION]: 'text-indigo-400 border-indigo-400 bg-indigo-900/20',
  [Zone.GUIDES]: 'text-cyan-400 border-cyan-400 bg-cyan-900/20',
  [Zone.CARDBOARD]: 'text-yellow-400 border-yellow-400 bg-yellow-900/20',
  [Zone.FORMING]: 'text-orange-400 border-orange-400 bg-orange-900/20',
  [Zone.SHRINK_FILM]: 'text-pink-400 border-pink-400 bg-pink-900/20',
  [Zone.DISCHARGE]: 'text-purple-400 border-purple-400 bg-purple-900/20',
};

export const CRITICALITY_COLORS = {
  [Criticality.LOW]: 'bg-gray-600',
  [Criticality.MEDIUM]: 'bg-yellow-600',
  [Criticality.HIGH]: 'bg-orange-600',
  [Criticality.CRITICAL]: 'bg-red-600 animate-pulse',
};