
export enum Zone {
  INFEED = 'Inmatning',
  SEPARATION = 'Separering',
  GUIDES = 'Gejdrar',
  CARDBOARD = 'Kartongmatning',
  FORMING = 'Formverktyg',
  SHRINK_FILM = 'Krympfilm Matning',
  DISCHARGE = 'Utmatning'
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
