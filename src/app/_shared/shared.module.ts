import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasePipe } from '../_pipes/case.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from 'ng2-currency-mask';

const modulesToExport = [
  CommonModule,
  MaterialModule,
  RouterModule,
  FormsModule,
  CurrencyMaskModule,
];
const declarationToExport = [
  CasePipe,
];

@NgModule({
  declarations: [
    ...declarationToExport
  ],
  imports: [
    ...modulesToExport,
  ],
  exports: [
    ...modulesToExport,
    ...declarationToExport,
  ]
})
export class SharedModule { }
