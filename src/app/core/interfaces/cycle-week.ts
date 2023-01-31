import { LocalDate } from "@js-joda/core";

export interface ICycleWeek {

    days: LocalDate[];

}

export class CycleWeek implements ICycleWeek {

    days: LocalDate[] = [];

    constructor(cycleWeek?: ICycleWeek) {
        this.days = cycleWeek?.days || Array(7).fill(LocalDate.now());
    }

    get starts(): LocalDate {
        return this.days.length > 0 ? this.days[0] : LocalDate.now();
    }

    get ends(): LocalDate {
        return this.days.length > 6 ? this.days[6] : LocalDate.now();
    }
}
