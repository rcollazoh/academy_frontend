// features/features.routes.ts
import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from './components/home/home';
import { MyCourses } from './components/my-courses/my-courses';
import { UpdatePerson } from './components/update-person/update-person';
import { ExitGuard } from '../core/guards/exit-guard';
import { Courses } from './components/courses/courses';
import { ActiveCourse } from './components/active-course/active-course';

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
        path: 'course-active',
        component: ActiveCourse,
      },
      {
        path: 'student-courses',
        component: MyCourses,
      },
      {
        path: 'courses',
        component: Courses,
      },
      {
        path: 'perfil/:id',
        component: UpdatePerson,
        canDeactivate: [ExitGuard],
      },
    ],
  },
];