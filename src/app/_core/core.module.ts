import { SpinnerComponent } from './../_/core/spinner/spinner.component';
import { SharedModule } from '../_shared/shared.module';
import { NgModule } from '@angular/core';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductManageComponent } from './product-manage/product-manage.component';
import { ErrorComponent } from './error/error.component';

const declarationToExport = [
  ListComponent,
  DetailComponent,
  ProductManageComponent,
  NotFoundComponent,
  SpinnerComponent,
];

@NgModule({
  declarations: [
    ...declarationToExport,
    ErrorComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    ...declarationToExport,
  ],
  entryComponents: [
    ProductManageComponent,
  ]
})
export class CoreModule { }
