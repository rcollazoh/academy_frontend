import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppUser } from "../../shared/components/app-user/app-user";
import { Observable, take } from 'rxjs';
import { UserLogin } from '../../shared/models/user-model';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LogoutRequest } from '../../shared/models/login-request';
import { NotificationService } from '../../shared/services/notification.service';
import { Routes } from '../../shared/consts/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, AppUser, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  @Input() isMenuOpened!: boolean;
  @Output() isShowSidebar = new EventEmitter<boolean>();
  public user$: Observable<UserLogin>;
  public routes: typeof Routes = Routes;

  constructor(
    private userService: AuthService, protected ngxLoaderService: NgxUiLoaderService, 
    private notificacionService: NotificationService, private router: Router,
  ) {
    this.user$ = this.userService.getUser();
  }

  public openMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;

    this.isShowSidebar.emit(this.isMenuOpened);
  }

  public signOut(): void {
    this.ngxLoaderService.start();

    this.userService.logout(this.getUserDataToLogout()).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.router.navigate([this.routes.HOME]);
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        if(err && err.name=='HttpErrorResponse'){
            this.notificacionService.notificationError('Por favor, revise su conexión');
          } else if (err && err.error)
            this.notificacionService.notificationError(err.error);
          else {
            this.notificacionService.notificationError('Error al cerrar sesión');
          }
      },
    }
    );
  }

  getUserDataToLogout(): LogoutRequest {
    let userData: any;
    const sub = this.user$
      .pipe(take(1))
      .subscribe((user: UserLogin) => (userData = user));
    sub.unsubscribe();
    const logoutData = {
      personId: userData.id,
    };
    return logoutData;
  }

}
