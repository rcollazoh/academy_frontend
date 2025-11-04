import { Component, inject } from '@angular/core';
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
import {
  TranslateService,
    TranslatePipe,
    TranslateDirective
} from "@ngx-translate/core";

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatTooltipModule, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
 private translate = inject(TranslateService);
  public routes: typeof Routes = Routes;

  constructor(protected router: Router, protected ngxLoaderService: NgxUiLoaderService, 
    private notificacionService: NotificationService, public dialog: MatDialog) { 

    this.translate.addLangs(['es', 'en']);
    this.translate.setFallbackLang('en');
    this.translate.use('en');
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
