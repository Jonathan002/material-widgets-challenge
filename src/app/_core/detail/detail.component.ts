import { ErrorService } from './../../_serivces/error.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../_models/product.model';
import { ProductsService } from '../../_serivces/products.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Update, Delete } from './../../_models/app.model';

import { ProductManageComponent } from '../product-manage/product-manage.component';
import * as Case from 'case';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  product: Product;
  templateSwitch: 'LOADING' | 'ERROR' | 'NOT_FOUND' | 'OK' = 'LOADING';
  dialogueSub: Subscription;

  constructor(
    private http: HttpClient,
    public products: ProductsService,
    private router: Router,
    public dialog: MatDialog,
    private err: ErrorService,
    private snackBar: MatSnackBar
    ) {}

  getProduct() {
    this.templateSwitch = 'LOADING';
    const parsed = this.router.parseUrl(this.router.url);
    const primaryOutlet = parsed.root.children.primary;
    const secondSegmentPath = primaryOutlet.segments[1] ? primaryOutlet.segments[1].path : null;
    if (secondSegmentPath) {
      this.products.read(null, secondSegmentPath).toPromise().then((res: Product) => {
        this.product = res;
        this.templateSwitch = 'OK';
      }).catch(err => {
        this.templateSwitch = this.err.handleTemplateError(err);
      });
    }
  }

  ngOnInit() {
    this.getProduct();
  }

  openDialog(method: Update | Delete): void {
    this.dialogueSub ? this.dialogueSub.unsubscribe() : null;
    const dialogRef = this.dialog.open(ProductManageComponent, {
      width: '320px',
      data: { product: this.product, method },
    });
    let capturedProduct: Product;
    this.dialogueSub = dialogRef.afterClosed().pipe(
      filter(product => product),
      switchMap((product) =>  {
        capturedProduct = product;
        return this.products[method](product);
      }),
      tap(() => this.snackBar.open(`${Case.title(method)} Success!`, null, { duration: 2000 })),
      tap(() => {
        if (method === 'delete') {
          this.router.navigate(['/', 'products']);
        } else if (method === 'update') {
          this.product = capturedProduct;
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.dialogueSub ? this.dialogueSub.unsubscribe() : null;
  }
}
