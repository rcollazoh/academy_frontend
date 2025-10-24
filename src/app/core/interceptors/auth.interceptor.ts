import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { UserLogin } from "../../shared/models/user-model";
import { Router } from "@angular/router";
import { Routes } from "../../shared/consts/routes";
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ErrorDialog, ErrorDialogModel } from '../../shared/components/error-dialog/error-dialog';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<any>(null);
    //public user$: Observable<UserLogin>;

    userData!: UserLogin;

    public routes: typeof Routes = Routes;

    constructor(private authService: AuthService,
        private router: Router, private notificacionService: NotificationService, private dialog: MatDialog) {
        //this.user$ = this.authService.getUser();
    }

    // @ts-ignore
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        /** urls que no llevan token*/
        if ((req.url.includes('login') || req.url.includes('recover_key') || req.url.includes('email/feedback') || req.url.includes('register') || req.url.includes('practice') || req.url.includes('area')) && !req.url.includes('student_course')) {

            return next.handle(req).pipe(
                catchError(error => {
                    return throwError(() => error);
                }
            ));

        } else if (req.url.includes('/academy/student_course/apply') || req.url.includes('/academy/image') || req.url.includes('/academy/student_course/upload_certify')) {//Servicios que no llevan 'Content-Type': 'application/json',

            const accessToken = localStorage.getItem('accessToken');

            if (accessToken) {
                return next.handle(this.addTokenWithOutContent(req, accessToken)).pipe(catchError(error => {
                    if (error instanceof HttpErrorResponse &&
                        !req.url.includes('login') &&
                        error.status === 401
                    ) {
                        return this.handle401Error(req, next, true);
                    }
                    else if (error.status === 403 && error.error.error.match('The Token has expired')) {
                        return this.refreshTokenWithOutContent(req, next);
                    } else {
                        return throwError(() => error);
                    }
                }));
            } else {
                return throwError(Error);
            }


        } else { /** urls que si llevan token*/
            const accessToken = localStorage.getItem('accessToken');

            if (accessToken) {
                return next.handle(this.addToken(req, accessToken)).pipe(
                    catchError(error => {

                        if (error instanceof HttpErrorResponse &&
                            !req.url.includes('login') &&
                            error.status === 401
                        ) {
                            return this.handle401Error(req, next, false);
                        }
                        else if (error.status === 403 && error.error.error.match('The Token has expired')) {
                            return this.refreshToken(req, next);
                        } else if (error.status === 400 && (error.error.error.match('ya está cerrada.'))) {
                            this.signOut();
                            return throwError(() => error);
                        } else {
                            return throwError(() => error);
                        }
                    }));
            } else {
                this.signOut();
                return throwError(Error);
            }
        }
    }

    private addTokenWithOutContent(request: HttpRequest<any>, token: string) {
        if (!token) {
            return request.clone({
                setHeaders: {
                }
            });
        }
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private addToken(request: HttpRequest<any>, token: string) {
        if (!token) {
            return request.clone({
                setHeaders: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return request.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
    }

    private refreshTokenWithOutContent(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshLogin().pipe(
                switchMap((accessToken: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(accessToken);
                    return next.handle(this.addTokenWithOutContent(request, accessToken));
                }));

        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addTokenWithOutContent(request, jwt));
                }));
        }
    }

    private refreshToken(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshLogin().pipe(
                switchMap((accessToken: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(accessToken);
                    return next.handle(this.addToken(request, accessToken));
                }));

        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addToken(request, jwt));
                }));
        }
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler, addTokenWithOutContent: boolean) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            if (this.authService.isLoggedIn()) {
                return this.authService.refreshLogin().pipe(
                    switchMap((accessToken: any) => {
                        this.isRefreshing = false;
                        this.refreshTokenSubject.next(accessToken);
                        if (addTokenWithOutContent) {
                            return next.handle(this.addTokenWithOutContent(request, accessToken));
                        } else
                            return next.handle(this.addToken(request, accessToken));
                    }),
                    catchError((error) => {
                        this.isRefreshing = false;

                        if (error.match("El token suministrado ha expirado")) {
                            this.signOut();
                            const dialogData = new ErrorDialogModel('Error', 'El token de acceso ha expirado. Por favor, vuelva a iniciar sesión.');
                            const dialogRef = this.dialog.open(ErrorDialog, {
                                maxWidth: '400px',
                                data: dialogData,
                            });
                        }

                        return throwError(() => error);;
                    })
                );
            }
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    if (addTokenWithOutContent) {
                        return next.handle(this.addTokenWithOutContent(request, jwt));
                    } else return next.handle(this.addToken(request, jwt));
                }));
        }

        return next.handle(request);
    }

    public signOut(): void {
        localStorage.clear();
        this.router.navigate([this.routes.LOGIN]);
    }
}
