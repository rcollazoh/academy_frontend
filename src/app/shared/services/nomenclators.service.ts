import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiCodeMessage } from '../consts/api-code-message.constant';

@Injectable({
  providedIn: 'root'
})
export class Nomenclators {

  constructor(private _http: HttpClient) {
  }

  handleServiceError(error: HttpErrorResponse) {
    let mensajeError = undefined;
    if (error.error instanceof ErrorEvent) {
      console.error('Error:', error.error.message);
      mensajeError = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          console.error(`Error del backend, código: ${error.status}, `);
          mensajeError = error.error.error;
          break;
        case 403:
          console.error(`Error del backend, código: ${error.status}, `);
          mensajeError = error.error;
          break;
        case 500:
          console.error(`Error del backend, código: ${error.status} `);
          break;
        case 503:
          console.error(`Error del backend, código: ${error.status} `);
          mensajeError = ApiCodeMessage.MSG_CODE_503;
          break;
        default:
          console.error(`Error: ${error} `);
          mensajeError = error;
          break;
      }
    }
    return throwError(() => mensajeError);
  }

  /** Se obtienen todas las areas*/
  getAllAreas(): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this._http
      .get<any>(environment.serviceArea, { headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  /** Obtener practicas por area */
  getPracticeByArea(areaId: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this._http
      .get<any>(environment.servicePractice + `/area` + `/${areaId}` , {headers})
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

}
