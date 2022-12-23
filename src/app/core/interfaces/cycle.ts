import { LocalDate } from "@js-joda/core";

import { Metadata } from "./metadata";
import { Requirements } from "./requirements";

export interface Cycle {
    id: number;
    title: string;
    alias: string;
    cycleStart: LocalDate;
    cycleEnd: LocalDate;
    cyclePreStart?: LocalDate;
    cyclePostEnd?: LocalDate;
    requirements: Requirements;
    metadata: Metadata;
}
