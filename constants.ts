
import { MachinePoint, Zone, Criticality, MachineModule } from './types';

export const DEFAULT_MACHINE_LAYOUT: MachineModule[] = [
  { id: 'm1', label: 'Inmatning (1-2)', x: 0, y: 15, width: 20, height: 12, color: '#3b82f6', hasFill: false },
  { id: 'm2', label: 'Separator (3-4)', x: 20, y: 15, width: 15, height: 12, color: '#6366f1', hasFill: false },
  { id: 'm3', label: 'Magasin (13)', x: 35, y: 32, width: 12, height: 15, color: '#eab308', hasFill: false },
  { id: 'm4', label: 'Formning (5-6)', x: 37, y: 5, width: 25, height: 22, color: '#f97316', hasFill: false },
  { id: 'm5', label: 'Filmlindning (9-10)', x: 62, y: 8, width: 18, height: 18, color: '#ec4899', hasFill: false },
  { id: 'm7', label: 'Filmspole (18)', x: 64, y: 30, width: 14, height: 12, color: '#f472b6', hasFill: false },
  { id: 'm6', label: 'Utmatning (8)', x: 80, y: 15, width: 20, height: 12, color: '#a855f7', hasFill: false }
];

export const MACHINE_POINTS: MachinePoint[] = [
  {
    id: 'LSK-B1',
    number: 1,
    name: 'Skiljeskenor (Vev B)',
    zone: Zone.INFEED,
    description: 'Breddinställning för produktens kanalisering. Justeras med vev B. Se manual fig 7.2.2.',
    targetValue: 'Visare B1 = 142',
    tolerance: '+/- 0.5',
    measureMethod: 'Mekanisk mätare B1',
    criticality: Criticality.MEDIUM,
    imagePlaceholder: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
    coordinates: { x: 10, y: 21 },
    visibleOnMap: true
  },
  {
    id: 'LSK-I1',
    number: 12,
    name: 'Kartongmatning Höjd (Vev I)',
    zone: Zone.CARDBOARD,
    description: 'Höjdjustering för kartonginmatningen. Justeras med vev I. Se manual fig 7.2.6.',
    targetValue: 'Visare I1 = 45.5',
    tolerance: '+/- 0.2',
    measureMethod: 'Siko-mätare I1',
    criticality: Criticality.HIGH,
    imagePlaceholder: 'https://images.unsplash.com/photo-1565608411386-35f922754972?auto=format&fit=crop&q=80&w=400',
    coordinates: { x: 38, y: 40 },
    visibleOnMap: true
  },
  {
    id: 'LSK-L1',
    number: 13,
    name: 'Kartongmatning Bredd (Vev L)',
    zone: Zone.CARDBOARD,
    description: 'Breddjustering för kartongmagasinets inmatning. Se manual fig 7.2.6.',
    targetValue: 'Visare L1 = 80.0',
    tolerance: '+/- 0.5',
    measureMethod: 'Siko-mätare L1',
    criticality: Criticality.MEDIUM,
    imagePlaceholder: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400',
    coordinates: { x: 44, y: 40 },
    visibleOnMap: true
  },
  {
    id: 'LSK-M1',
    number: 20,
    name: 'Formverktyg Brickdon (Vev M)',
    zone: Zone.FORMING,
    description: 'Breddinställning för brickformningsenheten. Se manual fig 7.2.8.',
    targetValue: 'Mätare M1 = 312',
    tolerance: '+/- 0.5',
    measureMethod: 'Mekanisk mätare M1',
    criticality: Criticality.HIGH,
    imagePlaceholder: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=400',
    coordinates: { x: 50, y: 16 },
    visibleOnMap: true
  },
  {
    id: 'LSK-SOL-CC',
    number: 25,
    name: 'Solenoidspel (Spole CC)',
    zone: Zone.FORMING,
    description: 'Kritiskt mekaniskt spel för manöverorganet (CC). Se manual kap 8.2.',
    targetValue: 'X: 1.5mm / Y: 0.5mm',
    tolerance: '+/- 0.05',
    measureMethod: 'Bladmått',
    criticality: Criticality.CRITICAL,
    imagePlaceholder: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
    coordinates: { x: 55, y: 12 },
    visibleOnMap: true
  },
  {
    id: 'LSK-SOL-CA',
    number: 26,
    name: 'Solenoidspel (Spole CA)',
    zone: Zone.FORMING,
    description: 'Kritiskt mekaniskt spel för manöverorganet (CA). Se manual kap 8.2.',
    targetValue: 'X: 1.8mm / Y: 0.2mm',
    tolerance: '+/- 0.05',
    measureMethod: 'Bladmått',
    criticality: Criticality.CRITICAL,
    imagePlaceholder: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
    coordinates: { x: 55, y: 20 },
    visibleOnMap: true
  },
  {
    id: 'LSK-F1',
    number: 4,
    name: 'Filmspole Position',
    zone: Zone.FILM_UNIT,
    description: 'Sidledsjustering av filmspolen på spindeln (placerad under maskinen). Se manual fig 7.2.4.',
    targetValue: 'Mätare F1 = 215',
    tolerance: '+/- 1.0',
    measureMethod: 'Siko-mätare F1',
    criticality: Criticality.MEDIUM,
    imagePlaceholder: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=400',
    coordinates: { x: 71, y: 36 },
    visibleOnMap: true
  },
  {
    id: 'LSK-CB2',
    number: 40,
    name: 'Knivstoppläge CB-2',
    zone: Zone.FILM_UNIT,
    description: 'Minsta tillåtna regleringsgrad för styrlagrets stoppläge i lindningsenheten. Se manual kap 8.4.',
    targetValue: '2.8°',
    tolerance: '+/- 0.1°',
    measureMethod: 'Encoder-position',
    criticality: Criticality.CRITICAL,
    imagePlaceholder: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400',
    coordinates: { x: 71, y: 15 },
    phaseAngle: 2.8,
    visibleOnMap: true
  },
  {
    id: 'LSK-P4',
    number: 55,
    name: 'Filmspänning (Regulator 4)',
    zone: Zone.FILM_UNIT,
    description: 'Tryckinställning för filmbroms/spänning vid spolen under maskinen. Punkt 4 i fig 8.7.2.',
    targetValue: '2.5 Bar',
    tolerance: '+/- 0.2',
    measureMethod: 'Manometer punkt 4',
    criticality: Criticality.HIGH,
    imagePlaceholder: 'https://images.unsplash.com/photo-1530315592271-bfc71333ef34?auto=format&fit=crop&q=80&w=400',
    coordinates: { x: 73, y: 34 },
    visibleOnMap: true
  }
];

export const ZONE_COLORS = {
  [Zone.INFEED]: 'text-blue-400 border-blue-400 bg-blue-900/20',
  [Zone.SEPARATION]: 'text-indigo-400 border-indigo-400 bg-indigo-900/20',
  [Zone.CARDBOARD]: 'text-yellow-400 border-yellow-400 bg-yellow-900/20',
  [Zone.FORMING]: 'text-orange-400 border-orange-400 bg-orange-900/20',
  [Zone.FILM_UNIT]: 'text-pink-400 border-pink-400 bg-pink-900/20',
  [Zone.DISCHARGE]: 'text-purple-400 border-purple-400 bg-purple-900/20',
};

export const CRITICALITY_COLORS = {
  [Criticality.LOW]: 'bg-gray-600',
  [Criticality.MEDIUM]: 'bg-yellow-600',
  [Criticality.HIGH]: 'bg-orange-600',
  [Criticality.CRITICAL]: 'bg-red-600 animate-pulse',
};
