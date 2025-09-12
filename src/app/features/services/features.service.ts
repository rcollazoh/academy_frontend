import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiCodeMessage } from '../../shared/consts/api-code-message.constant';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  constructor(private _http: HttpClient, private domSanitizer: DomSanitizer) { }

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
          mensajeError = error.error ? error.error : error;
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

  getStudentCourseByPersonByAreaAndPractice(personId: number, areaId: number, practiceId: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this._http
      .get<any>(environment.serviceEstudentCourse + `/by-person` + `/${personId}` + `/by-area` + `/${areaId}` + `/by-practice` + `/${practiceId}`, {headers})
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  getPersonById(personId: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this._http
      .get<any>(environment.servicePerson + `/${personId}`, {headers})
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  addPhoto(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      accept: '*/*',
    });
    
    return this._http
      .post<any>(environment.serviceApplyCourse, formData, { headers: headers, responseType: "blob" as "json" })
      .pipe(
        map(data => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))),
        catchError(this.handleServiceError)
      );
  }
  
}
