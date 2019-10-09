import { MatTableDataSource } from '@angular/material/table';
import { Product } from './product.model';
import { MatSort } from '@angular/material';
import {_isNumberValue} from '@angular/cdk/coercion';

// Implementing Custom Datasource as stated here: https://material.angular.io/components/table/api
// This is necessary since the original sortData favors having null values in front of table which
// is not ideal for the pagination workaround.
// Material Source Code: https://github.com/angular/components/blob/396154413538857811cb0c6bb71e4b4e26ecb320/src/material/table/table-data-source.ts
export class CustomDataSource extends MatTableDataSource<Product> {
  sortData: ((data: [], sort: MatSort) => []) = (data: [], sort: MatSort): [] => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction === '') { return data; }

    return data.sort((a, b) => {
      let valueA = this.sortingDataAccessor(a, active);
      let valueB = this.sortingDataAccessor(b, active);
      if (valueA === null) {
        return -1;
      } else if (valueB === null) {
        return 1;
      }

      switch (active) {
        case 'date':
          valueA = new Date(valueA).valueOf();
          valueB = new Date(valueB).valueOf();
          break;
        // this.sortingDataAccessor converts strings to numbers if number val detected
        case 'price':
        case 'title':
        default:
          break;
      }

      let comparatorResult = 0;
      if (valueA > valueB) {
        comparatorResult = 1;
      } else if (valueA < valueB) {
        comparatorResult = -1;
      }

      return comparatorResult * (direction === 'asc' ? 1 : -1);
    });
  }
}
