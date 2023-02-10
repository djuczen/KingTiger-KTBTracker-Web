import { PhysicalExam } from "./physical-exam";

export interface Candidate {
    id: number;
    cycleId: number;
    cycleCont: number;
    audit: boolean;
    poom: boolean;
    essays: number;
    letters: number;
    preExamWritten: number;
    examWritten: number;
    physicalExam: PhysicalExam;
    userId: string;
    displayName: string;
}
