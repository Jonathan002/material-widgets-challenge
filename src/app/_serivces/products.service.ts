import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product, ProductsQuery } from '../_models/product.model';
import { ErrorService } from './error.service';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  collection: Product[] = [];
  private collectionUpdates = new BehaviorSubject<Product[]>(this.collection);
  collectionUpdates$ = this.collectionUpdates.asObservable();

  constructor(
    private http: HttpClient,
    private err: ErrorService,
  ) {}

  updateCollection = (data) => {
    this.collection = data;
    this.collectionUpdates.next(this.collection);
    return this.collection;
  }

  create(newProduct: Product): Observable<Product[]> {
    const { api } = environment;
    const apiUrl = api('products');
    return this.http.post<Product[]>(apiUrl, newProduct).pipe(
      catchError(this.err.handle)
    );
  }
  read(query?: ProductsQuery, productName?: string): Observable<Product[] | Product> {
    const { api } = environment;
    productName = productName ? `/${productName}/` : '';
    const apiUrl = api(`products${productName}`, query);
    return this.http.get<Product[]>(apiUrl).pipe(
      tap((data) => {
        if (!productName) {
          this.updateCollection(data);
        }
      }),
    );
  }
  update(proudctUpdate: Product): Observable<null> {
    const { api } = environment;
    const apiUrl = api('products');
    return this.http.put<null>(apiUrl, proudctUpdate).pipe(
      catchError(this.err.handle)
    );
  }
  delete(productToDelete: Product): Observable<null> {
    const { id } = productToDelete;
    const { api } = environment;
    const apiUrl = api(`products/${id}`);
    return this.http.delete<null>(apiUrl).pipe(
      catchError(this.err.handle)
    );
  }
}
