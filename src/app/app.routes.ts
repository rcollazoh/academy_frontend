import { Routes } from '@angular/router';
import { Principal } from './home/principal/principal';
import { Register } from './core/components/register/register';
import { Login } from './core/components/login/login';
import { GeneralInfo } from './home/general-info/general-info';

export const routes: Routes = [
  
  { path: '', redirectTo: '/home',  pathMatch: 'full'},  
  { path: 'home', component: Principal },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'information', component: GeneralInfo },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
