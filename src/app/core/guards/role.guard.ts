import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { UserLogin } from "../../shared/models/user-model";
import { Routes } from "../../shared/consts/routes";
import { AuthService } from "../services/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { ConfirmDialog, ConfirmDialogModel } from "../../shared/components/confirm-dialog/confirm-dialog";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  user!: UserLogin;
  userRole: string = '';
  routerRoles: string[] = [];

  public routes: typeof Routes = Routes;

  constructor(protected authService: AuthService,
              public dialog: MatDialog,
              protected router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    

    if (localStorage.getItem('currentUser') != null) {
      this.user = JSON.parse(window.atob(JSON.parse(localStorage.getItem('currentUser')!).user));
      this.userRole = this.user.rol;
      this.routerRoles = route.data["permissions"].only as Array<string>;

      if (this.routerRoles.indexOf(this.userRole) > -1) {
        return true;
      } else {
        let msg = 'Lo sentimos, ¡Usted no posee los permisos necesarios para realizar esta acción!';
        const dialogData = new ConfirmDialogModel('Acceso denegado', msg,
          true, 'Aceptar', false, '');
        const dialogRef = this.dialog.open(ConfirmDialog, {
          maxWidth: '400px',
          data: dialogData,
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
          this.router.navigate([this.routes.INICIO]);
        });
      }
    }

    return false;
  }

}