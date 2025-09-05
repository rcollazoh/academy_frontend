import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Routes } from '../../shared/consts/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [MatButtonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  public routes: typeof Routes = Routes;

  constructor(protected router: Router) { }
  
  actionVerMas() {
    this.router.navigate([this.routes.INFORMATION]);
  }
}
