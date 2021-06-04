import { Injectable, Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'uniqueFilter',
  pure: false,
})
@Injectable()
export class UniqueFilterPipe implements PipeTransform {
  transform(items: any[], args: any[]): any {
    console.log(items, args);
    // lodash uniqBy function
    return _.uniqBy(items, args);
  }
}
