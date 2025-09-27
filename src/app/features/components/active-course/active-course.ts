import { Component, OnInit } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from '@angular/router';
import { Routes } from '../../../shared/consts/routes';
import { Observable, Subscription, take } from 'rxjs';
import { FeaturesService } from '../../services/features.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from '../../../shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { RouteService } from '../../../shared/services/route.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Course, Module, Question } from '../../../shared/models/course-model';
import { UserLogin } from '../../../shared/models/user-model';
import { ErrorDialog, ErrorDialogModel } from '../../../shared/components/error-dialog/error-dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { ClassViewer } from '../../../shared/components/class-viewer/class-viewer';
import { ExamViewer } from '../../../shared/components/exam-viewer/exam-viewer';

@Component({
  selector: 'app-active-course',
  imports: [MatCardModule, MatIconModule, RouterLink, MatButtonModule,
    MatExpansionModule,
    MatListModule, MatTooltip],
  templateUrl: './active-course.html',
  styleUrl: './active-course.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ActiveCourse implements OnInit {

  public routes: typeof Routes = Routes;
  lastRouteSubscription: Subscription;
  lastRoute = '';

  modules: Module[] = [];

  course: Course | undefined;

  public user$: Observable<UserLogin>;

  constructor(private featuresService: FeaturesService,
    protected ngxLoaderService: NgxUiLoaderService,
    private notificacionService: NotificationService,
    protected router: Router,
    public dialog: MatDialog,
    private routeService: RouteService,
    private authService: AuthService) {
    this.user$ = this.authService.getUser();
    this.lastRouteSubscription = this.routeService.lastRoute$.subscribe(lastRoute => {
      if (lastRoute) {
        this.lastRoute = lastRoute;
      } else {
        this.lastRoute = '';
      }
    });
  }

  ngOnInit(): void {
    this.getStudentCourseByPersonByAreaAndPractice();
  }

  /**
     * Metodo para obtener los datos del usuario logueado y pasarlo en el formulario de creacion
     */
  getUserData(): any {
    let userData: any = undefined;
    const sub = this.user$
      .pipe(take(1))
      .subscribe((user: UserLogin) => (userData = user));
    sub.unsubscribe();
    return userData;
  }

  getStudentCourseByPersonByAreaAndPractice(): void {
    this.ngxLoaderService.start();
    this.featuresService.getStudentCourseByPersonByAreaAndPractice(this.getUserData().id, this.getUserData().areaId, this.getUserData().practiceId).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        if (res && res.status == 'ACTIVATED') {
          this.course = res;
          this.getCourseModulesByCourseId(res.id);
        }
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        let msg = 'Lo sentimos, ocurrió un error al obtener los datos del curso.';
        const dialogData = new ErrorDialogModel('Error', msg);
        this.dialog.open(ErrorDialog, {
          maxWidth: '400px',
          data: dialogData,
        });
      },
    });
  }

  getCourseModulesByCourseId(courseId: number): void {
    this.ngxLoaderService.start();
    this.featuresService.getCourseModulesByCourseId(courseId).subscribe({
      next: (res) => {
        this.modules = res;
        this.ngxLoaderService.stop();
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          'Lo sentimos, ocurrió un error al obtener el curso'
        );
      },
    });
  }

  actionPlayClass(classId: number, classConfigId: number) {
    this.updateStatusClass(classId);
    this.dialog.open(ClassViewer, {
      data: { classId: classConfigId },
      width: '90vw',           // 90% del ancho de la ventana
      height: '90vh',          // 90% del alto de la ventana
      maxWidth: '100vw',       // evita que se limite por defecto
      panelClass: 'full-dialog', // clase personalizada opcional
      autoFocus: false
    });
  }

  updateStatusClass(classId: number): void {
    this.ngxLoaderService.startBackground();

    this.featuresService
      .updateClassStatus(classId, true)
      .subscribe({
        next: (res) => {
          this.ngxLoaderService.stopBackground();
          this.getCourseModulesByCourseId(this.course!.id);
        },
        error: (err) => {
          this.ngxLoaderService.stopBackground();
        },
      });

  }

  actionViewExam(examId: number) {
    this.dialog.open(ExamViewer, {
      data: { examId: examId },
      width: '90vw', 
      height: '90vh', 
      maxWidth: '100vw', 
      panelClass: 'full-dialog',
      autoFocus: false,
      disableClose: true
    });
  }

}
