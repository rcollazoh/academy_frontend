import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { NomAreaDto, NomPracticeDto } from '../../shared/models/nomenclator-model';
import { ApiCodeMessage } from '../../shared/consts/api-code-message.constant';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Register } from '../../shared/models/register-model';
import { LoginRequest } from '../../shared/models/login-request';
import { environment } from '../../../environments/environment';
import { UserLogin } from '../../shared/models/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user!: UserLogin;
  accessToken!: string | null;
  refreshToken!: string | null;
  isLoginSource = signal<boolean>(false);

  constructor(private _http: HttpClient) { }

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

  saveCurrentUser(): void {
    /** base64 encode */
    const userEncoded = btoa(JSON.stringify(this.user));

    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        user: userEncoded,
      })
    );
  }

  saveSecurityTokens(): void {
    if (this.accessToken) {
      localStorage.setItem('accessToken', this.accessToken);
    }

    if (this.refreshToken) {
      localStorage.setItem('refreshToken', this.refreshToken);
    }
  }

  /** Registrar nueva persona */
  registerPerson(register: Register): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });
    const options = {
      headers: headers,
    };
    return this._http.post<any>(environment.serviceRegister, register, options).pipe(
      map((res) => res),
      catchError(this.handleServiceError)
    );
  }

  login(loginRequest: LoginRequest): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    let queryParams = new HttpParams();

    loginRequest.username  !== undefined
      ? (queryParams = queryParams.append('username', loginRequest.username))
      : null;
    loginRequest.password !== undefined
      ? (queryParams = queryParams.append('password', loginRequest.password))
      : null;

    const options = {
      headers: headers,
      params: queryParams,
    };

    return this._http.get<any>(environment.serviceLogin + '?' + queryParams, {headers, observe: 'response'}).pipe(
      map((data) => {
        if (data.body.result) {
          this.user = data.body.result;
          let headers = data.headers;
          this.accessToken = headers.get("access_token");
          this.refreshToken = headers.get("refresh_token");
          this.saveCurrentUser();
          this.saveSecurityTokens();
          this.isLoginSource.set(true);
          return data.body;
        } else {
          return data.body;
        }
      }),
      catchError(this.handleServiceError)
    );
  }

}