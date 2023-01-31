import { Metadata } from "./metadata";
import { PhysicalExam } from "./physical-exam";

export interface Candidate {
    id: number;
    userId: string;
    cycleId: number;
    status: number;
    hidden: boolean;
    audit: boolean;
    cycleCont: number;
    poom: boolean;
    beltRank: number;
    essays: number;
    letters: number;
    preExamWritten: number;
    examWritten: number;
    physicalExam: PhysicalExam;
    metadata?: Metadata;
    displayName: string;
    sortedName?: string;
    givenName?: string;
    fullName?: string;
}
