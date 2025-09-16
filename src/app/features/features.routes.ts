// features/features.routes.ts
import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from './home/home';
import { MyCourses } from './my-courses/my-courses';
import { UpdatePerson } from './update-person/update-person';
import { ExitGuard } from '../core/guards/exit-guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'inicio',
        component: Home,
      },
      {
        path: 'courses',
        component: MyCourses,
      },
      {
        path: 'perfil/:id',
        component: UpdatePerson,
        canDeactivate: [ExitGuard],
      },
    ],
  },
];