
import { MachinePoint, Zone, Criticality, MachineModule } from './types';

export const DEFAULT_MACHINE_LAYOUT: MachineModule[] = [
  { id: 'm1', label: 'Inmatning', x: 2, y: 15, width: 12, height: 10, color: '#3b82f6' },
  { id: 'm2', label: 'Separering', x: 18, y: 15, width: 12, height: 10, color: '#6366f1' },
  { id: 'm3', label: 'Kartong', x: 35, y: 28, width: 15, height: 10, color: '#eab308' },
  { id: 'm4', label: 'Formverktyg', x: 42, y: 5, width: 22, height: 32, color: '#f97316' },
  { id: 'm5', label: 'Film/Krymp', x: 68, y: 10, width: 16, height: 20, color: '#ec4899' },
  { id: 'm6', label: 'Utmatning', x: 88, y: 15, width: 10, height: 10, color: '#a855f7' }
];

export const MACHINE_POINTS: MachinePoint[] = [
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
