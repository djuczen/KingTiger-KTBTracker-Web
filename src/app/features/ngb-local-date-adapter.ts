import { Injectable } from "@angular/core";
import { LocalDate } from "@js-joda/core";
import { NgbDateAdapter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class NgbLocalDateAdapter extends NgbDateAdapter<LocalDate> {

    fromModel(value: LocalDate | null): NgbDateStruct | null {
        if (value) {
            return { year: value?.year(), month: value?.month().value(), day: value?.dayOfMonth() };
        }
        return null;
    }
    toModel(date: NgbDateStruct | null): LocalDate | null {
        if (date) {
            return LocalDate.of(date.year, date.month, date.day);
        }
        return null;
    }
}
