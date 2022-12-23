import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rounded'
})
export class RoundedPipe implements PipeTransform {

  transform(value: number, method: string = 'round'): number {
    return method === 'floor' ? Math.floor(value) : method === 'ceil' ? Math.ceil(value) : Math.round(value);
  }
}
