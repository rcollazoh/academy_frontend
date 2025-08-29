import { Routes } from '@angular/router';
import { Principal } from './home/principal/principal';
import { Register } from './core/components/register/register';

export const routes: Routes = [
  
  { path: '', redirectTo: '/home',  pathMatch: 'full'},  
  { path: 'home', component: Principal },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
