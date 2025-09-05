import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Routes } from '../../shared/consts/routes';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatTooltipModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  public routes: typeof Routes = Routes;

  constructor(protected router: Router) { }

  actionLogin() {
    this.router.navigate([this.routes.LOGIN]);
  }

  actionRegister() {
    this.router.navigate([this.routes.REGISTER]);
  }

  actionHome() {
    this.router.navigate([this.routes.HOME]);
  }

}
