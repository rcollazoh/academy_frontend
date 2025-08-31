import { Routes } from '@angular/router';
import { Principal } from './home/principal/principal';
import { Register } from './core/components/register/register';
import { Login } from './core/components/login/login';

export const routes: Routes = [
  
  { path: '', redirectTo: '/home',  pathMatch: 'full'},  
  { path: 'home', component: Principal },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
