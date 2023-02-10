import { Metadata } from "./metadata";
import { PhysicalExam } from "./physical-exam";

export interface Candidate {
    id: number;
    userId: string;
    cycleId: number;
    userId: string;
    displayName: string;
    sortedName?: string;
    givenName?: string;
    fullName?: string;
}
