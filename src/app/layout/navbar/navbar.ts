import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Routes } from '../../shared/consts/routes';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from '@/app/shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@/app/core/services/auth.service';
import { Feedback } from '@/app/shared/components/feedback/feedback';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatTooltipModule, TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  public routes: typeof Routes = Routes;

  constructor(protected router: Router, protected ngxLoaderService: NgxUiLoaderService, 
    private notificacionService: NotificationService, public dialog: MatDialog,private translate: TranslateService) { 
    // Usa el idioma del navegador o uno específico
    this.translate.use('es');
    this.translate.get('LANDING.NAVBAR_TEXT_START').subscribe(value => {
    console.log('Traducción:', value);
  });
}

  actionLogin() {
    this.router.navigate([this.routes.LOGIN]);
  }

  actionRegister() {
    this.router.navigate([this.routes.REGISTER]);
  }

  actionHome() {
    this.router.navigate([this.routes.HOME]);
  }

  actionFeedback() {
    const dialogRef = this.dialog.open(Feedback, {
      width: '420px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.notificacionService.notificationSuccess('Se ha enviado su comentario');
      }
    });
  }

}
