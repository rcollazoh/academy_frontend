import { Component, OnInit, signal, Signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { Menu } from '../../models/menu-model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LogoutRequest } from '../../models/login-request';
import { Observable, take } from 'rxjs';
import { UserLogin } from '../../models/user-model';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Routes } from '../../consts/routes';
import { ErrorDialog, ErrorDialogModel } from '../error-dialog/error-dialog';
import { ConfirmDialog, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, MatNavList, MatListItem, MatExpansionModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  providers: [provideNativeDateAdapter()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Sidebar implements OnInit {

  public user$: Observable<UserLogin>;

  menuList!: Signal<Menu[]>;

  public routes: typeof Routes = Routes;

  constructor(private authService: AuthService, private dialog: MatDialog, protected ngxLoaderService: NgxUiLoaderService,
              private notificacionService: NotificationService, private translate: TranslateService,
              private router: Router) {
    this.user$ = this.authService.getUser();
  }

  ngOnInit(): void {
    this.menuList = this.getList();
  }

  isActive(route: string): boolean {
  return this.router.isActive(route, {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'});
}

  //Json del menu
  getList(): Signal<Menu[]> {
    let menuList: Menu[] = [];

    menuList = [
        {
          text: 'SIDEBAR.INFORMATION',
          icon: 'dashboard',
          routerLink: '/app/inicio',
          role: ['STUDENT']
        },
        {
          text: 'SIDEBAR.ACTIVE_COURSE',
          icon: 'school',
          routerLink: '/app/course-active',
          role: ['STUDENT']
        },
        {
          text: 'SIDEBAR.MY_COURSES',
          icon: 'book',
          routerLink: '/app/student-courses',
          role: ['STUDENT']
        },
        {
          text: 'SIDEBAR.COURSES',
          icon: 'book',
          routerLink: '/app/courses',
          role: ['TEACHER', 'ADMIN']
        },
        {
          text: 'SIDEBAR.HELP',
          icon: 'help',
          role: ['STUDENT']
        },
        {
          text: 'SIDEBAR.CLOSE_SESSION',
          icon: 'exit_to_app',
          role: ['STUDENT', 'TEACHER', 'ADMIN']
        },
      ]

    if(this.getLogedUserName().rol){
      menuList = menuList.filter(v => v.role.includes(this.getLogedUserName().rol));
    }    
  
    return signal(menuList);
  }

  onMenuClick(menu: string): void {
    if (menu === 'SIDEBAR.CLOSE_SESSION') {
      this.openDialog();
    } else if (menu === 'SIDEBAR.HELP'){
      this.abrirWhatsApp('50672195203', 'Prad Academy, necesito ayuda');
    }
  }

  openDialog(): void {
    let msg = this.translate.instant('SIDEBAR.ASK_CLOSE_SESSION');
    const dialogData = new ConfirmDialogModel('COMMON.WARNING', msg, true, 'COMMON.BTN_ACCEPT', true, 'COMMON.BTN_CANCEL');
    const dialogRef = this.dialog.open(ConfirmDialog, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.signOut();
      }
    });
  }

  public signOut(): void {
    this.ngxLoaderService.start();

    this.authService.logout(this.getUserDataToLogout()).subscribe({
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

  getLogedUserName(): any {
    let userData = undefined;
    const sub = this.user$
      .pipe(take(1))
      .subscribe((user: UserLogin) => (userData = user));
    sub.unsubscribe();
    return userData;
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

  abrirWhatsApp(numero: string, mensaje: string = ''): void {
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  

}
