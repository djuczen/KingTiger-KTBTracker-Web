import { DatePipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { convert, LocalDate } from '@js-joda/core';

@Pipe({
  name: 'localDate'
})
export class LocalDatePipe extends DatePipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) locale: string ) {
    super(locale);
  }
  
  override transform(value: null | undefined, format?: string, timezone?: string, locale?: string): null;
  override transform(value: LocalDate | Date | string | number, format?: string, timezone?: string, locale?: string): string | null;
  override transform(value: LocalDate | Date | string | number | null | undefined, format?: string, timezone?: string, locale?: string): string | null {
    if (value instanceof LocalDate) {
      return super.transform(convert(value).toDate(), format, timezone, locale);
    }
    return super.transform(value, format, timezone, locale);
  }
}
