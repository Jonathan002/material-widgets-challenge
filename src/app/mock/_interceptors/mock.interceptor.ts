import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../_services/api.service';



@Injectable()
export class MockInterceptor implements HttpInterceptor {
  constructor(public api: ApiService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return from(this.api.makeRequest(req)).pipe(
      switchMap((mockResponse: any) => {
        const { status } = mockResponse;
        if (status >= 200 && status < 300) {
          return of(new HttpResponse(mockResponse));
        } else {
          return throwError(new HttpErrorResponse(mockResponse));
        }
      })
    );
  }
}
