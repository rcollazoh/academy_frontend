import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '@/environments/environment';
import { PersonEntity } from '@/app/shared/models/person-model';
import { Course, ExamResult } from '@/app/shared/models/course-model';
import { CourseRequest } from '@/app/shared/models/course-request-model';
import { ApiCodeMessage } from '@/app/shared/consts/api-code-message.constant';


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

  /** Obtener cursos por persona */
  getStudentCoursesByPerson(personId: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });
    return this._http
      .get<any>(environment.serviceStudentCourse + `/by-person/${personId}`, { headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  getStudentCourseByPersonByAreaAndPractice(personId: number, areaId: number, practiceId: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this._http
      .get<any>(environment.serviceStudentCourse + `/by-person` + `/${personId}` + `/by-area` + `/${areaId}` + `/by-practice` + `/${practiceId}`, { headers })
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

  uploadCertify(personId: number, courseId: number, file: File): Observable<Course> {
    const formData = new FormData();
    formData.append('personId', personId.toString());
    formData.append('courseId', courseId.toString());
    formData.append('certify', file);

    return this._http.post<Course>(environment.serviceStudentCourse + '/upload_certify', formData);
  }

  downloadCertify(filename: string): Observable<Blob> {
    const options = {
      responseType: 'blob' as const,
      params: { filename }
    };
    return this._http.get(environment.serviceImagenes + '/pdf', options);
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
      .post<any>(environment.serviceStudentCourse + '/active' + '?' + queryParams, { headers: headers })
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
      .post<any>(environment.serviceStudentCourse + '/reject' + '?' + queryParams, { headers: headers })
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
      .get<any>(environment.serviceStudentCourse, options)
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  /** Obtener modulos de un curso */
  getCourseModulesByCourseId(courseId: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });
    return this._http
      .get<any>(environment.serviceStudentModule + `/by-course/${courseId}`, { headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  getClassWithNavigation(classId: number, currentImageId: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });
    return this._http
      .get<any>(environment.serviceConfigClassImage + `/class_navegation/${classId}/${currentImageId}`, { headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  getImageWithNavigation(classId: number, imageId: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });
    return this._http
      .get<any>(environment.serviceConfigClassImage + `/image_navegation/${classId}/${imageId}`, { headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  updateClassStatus(classId: number, status: boolean, currentImageId: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this._http
      .put<any>(environment.serviceStudentClass + `/${classId}/${status}/${currentImageId}`, {
        headers,
      })
      .pipe(
        map((res) => res),
        catchError(this.handleServiceError)
      );
  }

  getPhoto(filename: string): Observable<any> {
    const headers = new HttpHeaders({
      accept: '*/*',
    });

    return this._http
      .get<Blob>(environment.serviceImagenes + '?filename=' + `${filename}`, { headers: headers, responseType: "blob" as "json" })
      .pipe(
        map(data => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))),
        catchError(this.handleServiceError)
      );
  }

  getExamWithQuestionAndOptions(examId: number, totalQuestions: number): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });
    return this._http
      .get<any>(environment.serviceConfigExamQuestion + `/${examId}` + `/${totalQuestions}`, { headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  submitExamAnswers(examId: number, answers: ExamResult[]): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this._http
      .put<any>(environment.serviceStudentExam + `/${examId}`, answers, { headers: headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

}
