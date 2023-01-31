import { ChronoUnit, LocalDate } from "@js-joda/core";
import { CycleWeek } from "./cycle-week";

import { Metadata } from "./metadata";
import { Requirements } from "./requirements";

export interface ICycle {
    id: number;
    title: string;
    alias: string;
    cycleStart: LocalDate;
    cycleEnd: LocalDate;
    cyclePreStart?: LocalDate;
    cyclePostEnd?: LocalDate;
    cycleWeekStart: number;
    requirements: Requirements;
    metadata?: Metadata;
}

export class Cycle implements ICycle {
    id: number;
    title: string;
    alias: string;
    cycleStart: LocalDate;
    cycleEnd: LocalDate;
    cyclePreStart?: LocalDate;
    cyclePostEnd?: LocalDate;
    cycleWeekStart: number;
    requirements: Requirements;
    metadata?: Metadata;

    constructor(cycle: ICycle) {
        this.id = cycle.id;
        this.title = cycle.title;
        this.alias = cycle.alias;
        this.cycleStart = cycle.cycleStart;
        this.cycleEnd = cycle.cycleEnd;
        this.cyclePreStart = cycle.cyclePreStart;
        this.cyclePostEnd = this.cyclePostEnd;
        this.cycleWeekStart = cycle.cycleWeekStart;
        this.requirements = cycle.requirements;
        this.metadata = cycle.metadata;
        console.log(`Cycle(${this.title}, ${this.cycleStart}, ${this.cycleEnd})`, this);
    }

    public get cycleWeeks(): number {
        return this.cycleStart.until(this.cycleEnd, ChronoUnit.WEEKS).valueOf();
    }

    public get cycleWeek(): number {
        return this.cycleStart.until(LocalDate.now(), ChronoUnit.WEEKS).valueOf();
    }

    public get cycleDays(): number {
        return this.cycleStart.until(this.cycleEnd.plusDays(1), ChronoUnit.DAYS).valueOf();
    }

    public get cycleDay(): number {
        return this.cycleStart.until(LocalDate.now().plusDays(1), ChronoUnit.DAYS).valueOf();
    }

    public get cycleDate(): LocalDate {
        return this.cycleStart.plusDays(this.cycleDay);
    }


    public get currentWeek(): number {
        return this.cycleStart.until(LocalDate.now(), ChronoUnit.WEEKS).valueOf();
    }

    public get weekStarts(): LocalDate {
        return this.cycleStart.plusWeeks(this.currentWeek);
    }

    public get weekEnds(): LocalDate {
        return this.weekStarts.plusDays(6);
    }

    public validWeek(week?: number): number {
        return Math.min(Math.max(week || this.currentWeek, 0), this.cycleWeeks);
    }

    /**
     * Returns the week number of the cycle based on the passed CycleDate, LocalDate, week number or the current date (default).
     * 
     * @param dateOrWeek 
     * @returns 
     */
    public weekOf(dateOrWeek?: CycleWeek | LocalDate | string | number): number {
        const weekStart = (dateOrWeek instanceof CycleWeek) ? dateOrWeek.starts :
            (dateOrWeek instanceof LocalDate) ? dateOrWeek : 
                this.cycleStart.plusWeeks(typeof(dateOrWeek) == 'string' ? parseInt(dateOrWeek || '0') : 
                    dateOrWeek || this.currentWeek);
        return this.cycleStart.until(weekStart, ChronoUnit.WEEKS).valueOf();
    }

    public weekDaysOf(week?: string | number | null): CycleWeek {
        const weekStart = this.cycleStart.plusWeeks(typeof(week) == 'string' ? parseInt(week || '1') - 1 : week || this.currentWeek);
        return new CycleWeek({ days: Array(7).fill(LocalDate.now()).map((value, index) => weekStart.plusDays(index)) });
    }

    public weekDays() {

    }
    public weekOfStarts(week?: number): LocalDate {
        return this.cycleStart.plusWeeks(week || this.currentWeek);
    }

    public weekOfEnds(week?: number): LocalDate {
        return this.cycleStart.plusWeeks(week || this.currentWeek).plusDays(6);
    }

}