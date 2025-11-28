// features/features.routes.ts
import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from './components/home/home';
import { MyCourses } from './components/my-courses/my-courses';
import { UpdatePerson } from './components/update-person/update-person';
import { ExitGuard } from '../core/guards/exit-guard';
import { Courses } from './components/courses/courses';
import { ActiveCourse } from './components/active-course/active-course';
import { RoleGuard } from '../core/guards/role.guard';
import { PersonFilter } from './components/person-filter/person-filter';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'inicio',
        component: Home,
        data: {
          permissions: {
            only: ['STUDENT'],
          }
        },
      },
      {
        path: 'course-active',
        canActivate: [RoleGuard],
        component: ActiveCourse,
        data: {
          permissions: {
            only: ['STUDENT'],
          }
        },
      },
      {
        path: 'student-courses',
        canActivate: [RoleGuard],
        component: MyCourses,
        data: {
          permissions: {
            only: ['STUDENT'],
          }
        },
      },
      {
        path: 'courses',
        canActivate: [RoleGuard],
        component: Courses,
        data: {
          permissions: {
            only: ['TEACHER', 'ADMIN'],
          }
        },
      },
      {
        path: 'person-filter',
        canActivate: [RoleGuard],
        component: PersonFilter,
        data: {
          permissions: {
            only: ['TEACHER', 'ADMIN'],
          }
        },
      },
      {
        path: 'perfil/:id',
        component: UpdatePerson,
        canDeactivate: [ExitGuard],
      },
    ],
  },
];