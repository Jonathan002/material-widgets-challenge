import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Product, ManageProductData } from './../../_models/product.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-product-manage',
  templateUrl: './product-manage.component.html',
  styleUrls: ['./product-manage.component.scss']
})
export class ProductManageComponent implements OnInit {
  model: Product;
  method: string;
  alaphabetRegex = new RegExp(/^[a-zA-Z ]*$/)

  constructor(
    public dialogRef: MatDialogRef<ProductManageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ManageProductData,
    @Inject(LOCALE_ID) public locale: string,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      const { product, method } = this.data;
      this.method = method;
      this.model = product ? Object.assign(new Product('', ''), product) : new Product('', '');
    } else {
      throw Error('Manage Product Component must be initialized with data!');
    }
  }

  submit() {
    this.dialogRef.close(this.model);
  }
}
