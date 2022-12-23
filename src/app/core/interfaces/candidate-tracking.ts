import { LocalDate } from "@js-joda/core";

import { Statistics } from "./statistics";
import { Tracking } from "./tracking";


export interface CandidateTracking {
    userId: string;
    candidateId: number;
    cycleId: number;
    startDate: LocalDate;
    endDate: LocalDate;
    statistics: Statistics;
    daily: Tracking[];
}
