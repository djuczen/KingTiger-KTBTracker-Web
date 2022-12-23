import { LocalDate } from "@js-joda/core";
import { Requirements } from "./requirements";

export interface Tracking {
    trackingDate: LocalDate;
    candidateId: number;
    cycleId: number;
    requirements: Requirements;
}
