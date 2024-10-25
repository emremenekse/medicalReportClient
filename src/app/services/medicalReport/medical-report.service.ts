import { Injectable } from '@angular/core';
import { HttpClientServiceService } from '../httpClient/http-client.service';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedicalReportService {

  constructor(private httpClientService: HttpClientServiceService) { }

  getQueries(query:any): Observable<any> {
    const querystrings = `searchText=${encodeURIComponent(query)}`;
    return this.httpClientService.get({
      controller:"MedicalReport",
      action: "Search",
      querystrings: querystrings
    }).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
    let errorMessage = 'An unexpected error occurred.';
    if (errorResponse.error) {
      errorMessage = errorResponse.error.error || errorResponse.message;
    }
    return throwError(() => new Error(errorMessage));
  })
    );;
  }

  getModifiedDocuments(): Observable<any> {
    return this.httpClientService.get({
      controller:"MedicalReport",
      action: "GetAllModifiedDocuments",
    }).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
    let errorMessage = 'An unexpected error occurred.';
    if (errorResponse.error) {
      errorMessage = errorResponse.error.error || errorResponse.message;
    }
    return throwError(() => new Error(errorMessage));
  })
    );;
  }
}
