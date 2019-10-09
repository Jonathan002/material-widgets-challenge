import { CustomDataSource } from './../../_models/custom-datasource.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as Case from 'case';
import { merge, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { Create } from './../../_models/app.model';
import { Product } from './../../_models/product.model';
import { ProductsService } from '../../_serivces/products.service';
import { ProductManageComponent } from '../product-manage/product-manage.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  isErrored = false;
  dataSource: MatTableDataSource<Product>;
  displayedColumns: string[] = ['title', 'price', 'date'];
  productsSub: Subscription;
  batchSize = 40;
  batchSizeIncrementer = this.batchSize;
  loadNextBatch = false;
  finalPage = false;
  lastKnownLength = 0;

  searchText$ = new Subject<string>();
  searchSub: Subscription;
  dialogueSub: Subscription;
  private searchActivated = false;

  constructor(
    public products: ProductsService,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  openDialog(method: Create): void {
    this.dialogueSub ? this.dialogueSub.unsubscribe() : null;
    const dialogRef = this.dialog.open(ProductManageComponent, {
      width: '320px',
      data: { method },
    });
    let capturedProduct: Product;
    this.dialogueSub = dialogRef.afterClosed().pipe(
      filter(result => result),
      tap((result) => capturedProduct = result),
      switchMap((result) => this.products.create(result)),
      tap(() => this.snackBar.open(`${Case.title(method)} Success!`, null, { duration: 2000 })),
      tap((created) => this.router.navigate(['products', Case.kebab(capturedProduct.title)])),
    ).subscribe();
  }

  updateTable(update) {
    (update as any).push({ last: true }); // hack to give table 1 more length for batch request
    this.dataSource = new CustomDataSource(update);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.checkIfFinalPage();
    this.lastKnownLength = this.dataSource.data.length;
  }

  lastPageReached() {
    this.finalPage = true;
    this.batchSize -= this.batchSizeIncrementer;
  }

  loadNextBatchIfLastPagination(e) {
    if (this.searchActivated) {
      return;
    }
    const { pageIndex, pageSize, length } = e;
    this.loadNextBatch = pageSize * (pageIndex + 1) > length;
    this.finalPage = false;
    if (this.loadNextBatch) {
      this.batchSize += this.batchSizeIncrementer;
      this.makeBatchRequest({ batchSize: this.batchSize });
    }
  }

  setupSearch() {
    const canSearchQuery$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(text => text.length > 0),
      tap(searchTerm => {
        this.searchActivated = true;
        this.finalPage = false;
      }),
      switchMap(searchTerm => this.makeBatchRequest({ search: searchTerm })),
    );
    const canBatchQuery$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(text => text.length === 0),
      tap(searchTerm => {
        if (this.searchActivated) {
          this.finalPage = false;
          this.makeBatchRequest({ batchSize: this.batchSize });
        }
        this.searchActivated = false;
      })
    );
    const handleSearchStream$ = merge(canSearchQuery$, canBatchQuery$).pipe(tap(() => this.paginator.firstPage()))
    this.searchSub = handleSearchStream$.subscribe();
  }

  private checkIfFinalPage() {
    if (this.lastKnownLength === this.dataSource.data.length && !this.searchActivated) {
      this.lastPageReached();
      return true;
    }
    return false;
  }

  ngOnInit() {
    // Note: New batched retrieved can come with new documents added causing client to be at incorrect pagination index
    // TODO: create local client bookmark with id and auto navigate pagination of new collection fetched
    this.productsSub = this.products.collectionUpdates$.subscribe(update => {
      this.updateTable(update);
    });
    this.makeBatchRequest({ batchSize: this.batchSize });
    this.setupSearch();
  }

  private makeBatchRequest(query) {
    this.loadNextBatch = true;
    return this.products.read(query).toPromise()
    .catch(err => this.isErrored = true)
    .finally(() => this.loadNextBatch = false);
  }


  ngOnDestroy() {
    this.searchSub.unsubscribe();
    this.productsSub.unsubscribe();
    this.dialogueSub ? this.dialogueSub.unsubscribe() : null;
  }
}
