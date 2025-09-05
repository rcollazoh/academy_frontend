// features/features.routes.ts
import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from './home/home';
import { MyCourses } from './my-courses/my-courses';

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
        component: MyCourses,}
    ],
  },
];