import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiCodeMessage } from '../../shared/consts/api-code-message.constant';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { PersonEntity } from '../../shared/models/person-model';
import { CourseRequest } from '../../shared/models/course-request-model';

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  /** Obtener cursos por persona */
  getStudentCoursesByPerson(personId: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });
    return this._http
      .get<any>(environment.serviceEstudentCourse + `/by-person/${personId}`, { headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

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
      .get<any>(environment.serviceEstudentCourse + `/by-person` + `/${personId}` + `/by-area` + `/${areaId}` + `/by-practice` + `/${practiceId}`, { headers })
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
      .get<any>(environment.servicePerson + `/${personId}`, { headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  applyCourse(formData: FormData): Observable<any> {
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

  activeCourse(personId?: number, courseId?: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    let queryParams = new HttpParams();

    personId != null
      ? (queryParams = queryParams.append('personId', personId))
      : null;

    courseId !=null
    ? (queryParams = queryParams.append('courseId', courseId))
    : null;

    return this._http
      .post<any>(environment.serviceEstudentCourse + '/active' + '?' + queryParams, { headers: headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  rejectCourse(personId?: number, courseId?: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    let queryParams = new HttpParams();

    personId != null
      ? (queryParams = queryParams.append('personId', personId))
      : null;

    courseId !=null
    ? (queryParams = queryParams.append('courseId', courseId))
    : null;

    return this._http
      .post<any>(environment.serviceEstudentCourse + '/reject' + '?' + queryParams, { headers: headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  /** Editar perfil */
  editPerson(reqUser: PersonEntity, personId: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this._http
      .put<any>(environment.servicePerson + `/${personId}`, reqUser, {
        headers,
      })
      .pipe(
        map((res) => res),
        catchError(this.handleServiceError)
      );
  }

  getCourses(request: CourseRequest, pageNumber: number, pageSize: number, sort: string): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    let queryParams = new HttpParams();

    request.status !== undefined
      ? (queryParams = queryParams.append('status', request.status))
      : null;
    request.courseName !== undefined
      ? (queryParams = queryParams.append('courseName', request.courseName))
      : null;
    pageNumber !== undefined
      ? (queryParams = queryParams.append('pageNumber', pageNumber))
      : null;
    pageSize !== undefined
      ? (queryParams = queryParams.append('pageSize', pageSize))
      : null;
    sort !== undefined
      ? (queryParams = queryParams.append('sort', sort))
      : null;

    const options = {
      headers: headers,
      params: queryParams,
    };

    return this._http
      .get<any>(environment.serviceEstudentCourse, options)
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

}
