import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

import { catchError, map, Observable, of } from 'rxjs';

import { IpiSnackbarService } from '@ipi-soft/ng-components/snackbar';

type SuccessStatus = 200 | 201 | 202 | 204;

interface SuccessResponse<R> {
  status: SuccessStatus;
  data: R;
}

type ErrorStatus = 400 | 401 | 402 | 403 | 404 | 405 | 409 | 498;

interface ErrorResponse {
  status: ErrorStatus;
  error: string;
}

export type CustomResponse<R> = SuccessResponse<R> | ErrorResponse;

interface HttpOptions {
  headers?: HttpHeaders;
  observe: 'response';
  responseType?: any;
}

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  constructor(
    private ngZone: NgZone,
    private httpClient: HttpClient,
    private ipiSnackbarService: IpiSnackbarService) { }

  public get<R>(url: string, responseType?: string, shouldShowSnackbar?: boolean): Observable<CustomResponse<R>> {
    return this.httpClient.get(url, this.getOptions(responseType))
      .pipe(
        map((response: HttpResponse<any>) => {
          return this.handleSuccess<R>(response);
        }),
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, shouldShowSnackbar);
        }),
      )
  }

  public post<B, R>(url: string, body: B, responseType?: string, shouldShowSnackbar?: boolean): Observable<CustomResponse<R>> {
    return this.httpClient.post(url, body, this.getOptions(responseType))
      .pipe(
        map((response: HttpResponse<any>) => {
          return this.handleSuccess<R>(response, shouldShowSnackbar);
        }),
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        }),
      )
  }

  public patch<B, R>(url: string, body: B, responseType?: string, shouldShowSnackbar?: boolean): Observable<CustomResponse<R>> {
    return this.httpClient.patch(url, body, this.getOptions(responseType))
      .pipe(
        map((response: HttpResponse<any>) => {
          return this.handleSuccess<R>(response);
        }),
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        }),
      );
  }

  public delete<R>(url: string, responseType?: string, shouldShowSnackbar?: boolean): Observable<CustomResponse<R>> {
    return this.httpClient.delete(url, this.getOptions(responseType))
      .pipe( 
        map((response: HttpResponse<any>) => {
          return this.handleSuccess<R>(response);
        }),
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        })
      )
  }

  private getOptions(responseType: string | undefined): HttpOptions {
    const options: HttpOptions = {
      observe: 'response',
      responseType: responseType ? responseType : 'json',
    };

    return options;
  }

  private handleSuccess<R>(response: HttpResponse<R>, shouldShowSnackbar: boolean = true): SuccessResponse<R> {
    const customResponse: SuccessResponse<R> = {
      status: response.status as SuccessStatus,
      data: response.body ? response.body : { } as R,
    }

    return customResponse;
  }

  private handleError(error: HttpErrorResponse, shouldShowSnackbar: boolean = true): Observable<ErrorResponse> {
    const customResponse: ErrorResponse = {
      status: error.status as ErrorStatus,
      error: error.error ? error.error.message : 'No error message',
    };

    if (shouldShowSnackbar) {
      this.ngZone.runOutsideAngular(() => {
        this.ipiSnackbarService.open(customResponse.error, { error: true });
      });
    }

    return of(customResponse);
  }

}
