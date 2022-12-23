import { Statistics } from "./statistics";

export interface FullStatistics {

    candidateId: number;
    cycleId: number;
    
    cycle: Statistics;
    weekly: Statistics[];
}
