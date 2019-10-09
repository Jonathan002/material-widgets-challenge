import { Pipe, PipeTransform } from '@angular/core';
import * as Case from 'case';

@Pipe({
  name: 'case'
})
export class CasePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return Case[args](value);
  }
}
