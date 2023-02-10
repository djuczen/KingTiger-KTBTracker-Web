import { ChronoUnit, LocalDate } from "@js-joda/core";
import { NGXLogger } from "ngx-logger";
import { Cycle } from "./interfaces/cycle";
import { Utils } from "./utils";

export class CycleDates {

  public static get currentDate(): LocalDate {
    return LocalDate.now();
  }

  /**
   * Returns the zero-based week of the active cycle.
   * 
   * If a week number was provided via query parameters ("week") it used (converted to zero-based), otherwise the week relative
   * to the current date is used.
   */
  public static currentWeek(cycle: Cycle, week?: string | number | null): number {
    if (week !== undefined) {
      return Math.min(Math.max(parseInt(week?.toString() || '1') - 1, 0), CycleDates.cycleWeeks(cycle));
    } 
    return  Math.min(Math.max(cycle.cycleStart.until(CycleDates.currentDate, ChronoUnit.WEEKS), 0), CycleDates.cycleWeeks(cycle));
  }

  public static cycleWeeks(cycle: Cycle): number {
    return cycle.cycleStart.until(cycle.cycleEnd, ChronoUnit.WEEKS).valueOf();
  }

  public static cycleDays(cycle: Cycle): number {
    return cycle.cycleStart.until(cycle.cycleEnd.plusDays(1), ChronoUnit.DAYS).valueOf();
  }

  public static cycleDay(cycle: Cycle): number {
    return cycle.cycleStart.until(CycleDates.currentDate.plusDays(1), ChronoUnit.DAYS).valueOf();
  }

  public static weekStarts(cycle: Cycle): LocalDate {
    return cycle.cycleStart.plusWeeks(CycleDates.currentWeek(cycle));
  }

  public static weekEnds(cycle: Cycle): LocalDate {
    return CycleDates.weekStarts(cycle).plusDays(6);
  }

  public static weekDays(cycle: Cycle): LocalDate[] {
    return Array(7).fill(LocalDate.now()).map((value, index) => CycleDates.weekStarts(cycle).plusDays(index));
  }

  public static weekDay(cycle: Cycle, index: number): number {
    return CycleDates.weekStarts(cycle).plusDays(index).dayOfWeek().value();
  }

  public static weekDate(cycle: Cycle, index: number): LocalDate {
    return CycleDates.weekStarts(cycle).plusDays(index);
  }

  public static weekColor(cycle: Cycle, overall?: number): string {
    if (overall !== undefined) {
      return overall > 0 ? Utils.percentAsColor(overall) : 'black';
    }
    return 'white';
  }
}
