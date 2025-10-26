import { Routes } from '@angular/router';
import { Register } from './core/components/register/register';
import { Login } from './core/components/login/login';
import { Principal } from './landing/principal/principal';
import { GeneralInfo } from './landing/general-info/general-info';
import { SecurityPolicies } from './landing/security-policies/security-policies';

export const routes: Routes = [
  
  { path: '', redirectTo: '/home',  pathMatch: 'full'},  
  { path: 'home', component: Principal },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'information', component: GeneralInfo },
  { path: 'policies', component: SecurityPolicies },
  //{ path: '**', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'app',
    loadChildren: () =>
      import('./features/features.routes').then((m) => m.routes),
  },
];
