import { Metadata } from "./metadata";
import { Requirements } from "./requirements";

export interface Cycle {
    id: number;
    title: string;
    alias: string;
    cycleStart: Date;
    cycleEnd: Date;
    cyclePreStart?: Date;
    cyclePostEnd?: Date;
    requirements: Requirements;
    metadata: Metadata;
}
