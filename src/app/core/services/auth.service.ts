import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { NomAreaDto, NomPracticeDto } from '../../shared/models/nomenclator-model';
import { ApiCodeMessage } from '../../shared/consts/api-code-message.constant';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Register } from '../../shared/models/register-model';
import { LoginRequest, LogoutRequest } from '../../shared/models/login-request';
import { environment } from '../../../environments/environment';
import { UserLogin } from '../../shared/models/user-model';
import { Router } from '@angular/router';
import { Routes } from '../../shared/consts/routes';

const USER_KEY = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user!: UserLogin;
  accessToken!: string | null;
  refreshToken!: string | null;
  isLoginSource = signal<boolean>(false);

  public routes: typeof Routes = Routes;

  constructor(private _http: HttpClient, private router: Router) { }

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

  public getUser(): Observable<any> {
    const userEncoded = localStorage.getItem('currentUser');
    if (userEncoded) {
      const user = JSON.parse(userEncoded).user;
      return of(JSON.parse(atob(user)));
    } else {
      this.router.navigate([this.routes.LOGIN]);
      return of(null);
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

    return this._http.get<any>(environment.serviceLogin + '?' + queryParams, {headers, observe: 'response'}).pipe(
      map((data) => {
        if (data.body.result) {
          this.user = data.body.result;
          this.user.rol = data.body.result.authorities[0].authority;
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

  refreshLogin(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`
    });

    const options = {
      headers: headers,
      observe: 'response' as const
    };

    return this._http.get<any>(environment.serviceRefreshToken, options).pipe(
      map((data) => {
        if (data.headers){
          let headers = data.headers;
          this.accessToken = headers.get("access_token");
          this.refreshToken = headers.get("refresh_token");
          this.saveSecurityTokens();
          return this.accessToken;
        } else {
          return false;
        }
      }),
      catchError(this.handleServiceError)
    );
  }

  public isLoggedIn(): boolean {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }

  logout(data: LogoutRequest): Observable<any> {
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this._http
      .post<any>(environment.serviceLogout, data, HttpOptions)
      .pipe(
        map((res) => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          /** esta comentado para que no se limpien los codificafdores  que se guardaron ahi */
          // localStorage.clear();
          //this.roleService.flushRolesAndPermissions();
          this.isLoginSource.set(false);
          return of(true);
        }),
        catchError(this.handleServiceError)
      );
  }

  recoverKey(email: string, idNumber: string): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this._http
      .get<any>(environment.servicePerson + `/recover_key?email=${email}&idNumber=${idNumber}`, { headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

  sendFeedback(personName: string, message: string): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this._http
      .post<any>(environment.serviceEmail + `/feedback?personName=${personName}&message=${message}`, { headers })
      .pipe(
        map((data) => data),
        catchError(this.handleServiceError)
      );
  }

}