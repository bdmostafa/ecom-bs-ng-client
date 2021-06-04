import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bdCurrency',
})
export class BdCurrencyPipe implements PipeTransform {
  transform(value: number, decimalLimit: number = 2): string {
    function countPlaces(num) {
      let text = num.toString();
      let idx = text.indexOf('.');
      return idx == -1 ? 0 : text.length - idx - 1;
    }

    if (!value) return null;
    else {
      if (countPlaces(value) > 2 && countPlaces(value) >= decimalLimit) {
        return `৳ ${value.toFixed(decimalLimit)}`;
      } else return `৳ ${value.toFixed(2)}`;
    }
    // return '&#2547';
  }
}
