
export enum Zone {
  INFEED = 'Inmatning (Enhet 1-2)',
  SEPARATION = 'Separering (Enhet 3)',
  CARDBOARD = 'Kartongmagasin (Enhet 11-13)',
  FORMING = 'Brickformning (Enhet 5, 20)',
  FILM_UNIT = 'Filmlindning/Kniv (Enhet 9-10, 18)',
  DISCHARGE = 'Utmatning (Enhet 8)'
}

export enum Criticality {
  LOW = 'Låg',
  MEDIUM = 'Medium',
  HIGH = 'Hög',
  CRITICAL = 'Kritisk (Kraschrisk)'
}

export interface MachineModule {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface MachinePoint {
  id: string;
  number: number;
  name: string;
  zone: Zone;
  description: string;
  targetValue: string;
  tolerance: string;
  measureMethod: string;
  criticality: Criticality;
  imagePlaceholder: string;
  coordinates: { x: number; y: number };
  visibleOnMap: boolean;
  phaseAngle?: number;
  lastChecked?: string;
}

export interface GenerationRequest {
  pointName: string;
  currentValue: string;
  riskContext: string;
}
