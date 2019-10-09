import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private snackBar: MatSnackBar) {}

  handle = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
        const { statusText } = error;
        switch (statusText) {
          default:
            this.snackBar.open('There was a problem processing the request. Please reload the page and try again.');
            break;
        }
    }
    return throwError('An error had occured! Please try again later.');
  };

  handleTemplateError = (error: HttpErrorResponse): 'NOT_FOUND' | 'ERROR' => {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else if (error.statusText && error.statusText === 'NOT_FOUND') {
        return error.statusText;
    }
    return 'ERROR';
  }
}
