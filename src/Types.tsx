export enum Steps {
  Activating = 'activating',
  Belief = 'belief',
  Consequences = 'consequences',
  Dispute = 'dispute'
}
export interface Abcd {
  id: string;
  activating: string;
  belief: string;
  consequences: string;
  dispute: string;
}
