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

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, MatNavList, MatListItem, MatExpansionModule, CommonModule, RouterLink],
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
              private notificacionService: NotificationService,
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
          text: 'Información',
          icon: 'dashboard',
          routerLink: '/app/inicio',
          role: ['student', 'teacher', 'admin']
        },
        {
          text: 'Curso actual',
          icon: 'school',
          routerLink: '/app/course-active',
          role: ['student']
        },
        {
          text: 'Mis cursos',
          icon: 'book',
          routerLink: '/app/student-courses',
          role: ['student']
        },
        {
          text: 'Cursos',
          icon: 'book',
          routerLink: '/app/courses',
          role: ['student','teacher', 'admin']
        },
        {
          text: 'Cerrar sesión',
          icon: 'exit_to_app',
          role: ['student', 'teacher', 'admin']
        },
      ]

    if(this.getLogedUserName().rol){
      menuList = menuList.filter(v => v.role.includes(this.getLogedUserName().rol));
    }    
  
    return signal(menuList);
  }

  onMenuClick(menu: string): void {
    if (menu === 'Cerrar sesión') {
      this.openDialog();
    }
  }

  openDialog(): void {
    let msg = 'Seguro desea cerrar la sesión';
    const dialogData = new ConfirmDialogModel('Advertencia', msg, true, 'Aceptar', true, 'Cancelar');
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
      if(err.name=='HttpErrorResponse'){
        let msg = 'Por favor, revise su conexión.';
        const dialogData = new ErrorDialogModel('Error', msg);
        const dialogRef = this.dialog.open(ErrorDialog, {
          maxWidth: '400px',
          data: dialogData,
        });
      }
      else {
        const dialogData = new ErrorDialogModel('Error', err);
        const dialogRef = this.dialog.open(ErrorDialog, {
          maxWidth: '400px',
          data: dialogData,
        });
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
  

}
