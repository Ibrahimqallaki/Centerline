
export enum Zone {
  INFEED = 'Inmatning (Enhet 1-2)',
  SEPARATION = 'Separering (Enhet 3)',
  CARDBOARD = 'Kartongmagasin (Enhet 11-13)',
  FORMING = 'Brickformning (Enhet 5, 20)',
  FILM_UNIT = 'Filmlindning/Kniv (Enhet 9-10, 18)',
  DISCHARGE = 'Utmatning (Enhet 8)'
}

export enum Criticality {
  P1 = 'P1: Kritisk (Haveri & Kvalitet)',
  P2 = 'P2: Viktig (Produktivitet & Slitage)',
  P3 = 'P3: Standard (Processoptimering)'
}

export enum PointStatus {
  OK = 'OK',
  TAGGED_RED = 'Röd Tagg (P1)',
  TAGGED_YELLOW = 'Gul Tagg (P2)',
  OUT_OF_SPEC = 'Utanför Standard'
}

export interface MachineModule {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  hasFill?: boolean;
  fontSize?: number;
  wrapText?: boolean;
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
  imagePlaceholder2?: string;
  coordinates: { x: number; y: number };
  visibleOnMap: boolean;
  phaseAngle?: number;
  lastChecked?: string;
  status?: PointStatus;
  tagComment?: string;
}

export interface GenerationRequest {
  pointName: string;
  currentValue: string;
  riskContext: string;
}
