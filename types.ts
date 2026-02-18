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

export interface MachinePoint {
  id: string; // e.g., "P-01"
  number: number;
  name: string;
  zone: Zone;
  description: string;
  targetValue: string; // e.g., "115°", "25mm"
  tolerance: string; // e.g., "+/- 2°"
  measureMethod: string; // e.g., "Siko", "Digital", "Linjal", "Ögonmått"
  criticality: Criticality;
  imagePlaceholder: string; // URL for placeholder
  coordinates: { x: number; y: number }; // Percentage on map
  visibleOnMap: boolean; // Toggle for map visibility
  phaseAngle?: number; // If applicable to 360 cycle
  lastChecked?: string;
}

export interface GenerationRequest {
  pointName: string;
  currentValue: string;
  riskContext: string;
}