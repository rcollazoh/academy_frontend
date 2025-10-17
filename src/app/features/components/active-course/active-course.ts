import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';
import { Observable, Subscription, take } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { StateModulePipe } from '@/app/shared/pipes/state-module-pipe';
import { Routes } from '@/app/shared/consts/routes';
import { Course, Exam, Lesson, Module } from '@/app/shared/models/course-model';
import { UserLogin } from '@/app/shared/models/user-model';
import { NotificationService } from '@/app/shared/services/notification.service';
import { RouteService } from '@/app/shared/services/route.service';
import { AuthService } from '@/app/core/services/auth.service';
import { ErrorDialog, ErrorDialogModel } from '@/app/shared/components/error-dialog/error-dialog';
import { ExamViewer } from '@/app/shared/components/exam-viewer/exam-viewer';
import { ClassViewer } from '@/app/shared/components/class-viewer/class-viewer';
import { FeaturesService } from '@/app/features/services/features.service';


@Component({
  selector: 'app-active-course',
  imports: [MatCardModule, MatIconModule, MatButtonModule,
    MatExpansionModule,
    MatListModule, MatTooltip, StateModulePipe],
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

  modules = signal<Module[]>([]);

  showNoActive = false;

  course= signal<Course>({
    id: 0,
    personId: 0,
    startDate: '',
    endDate: '',
    status: ''
  });

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
        if (res.status == 'ACTIVATED') {
          this.course.set(res);
          this.showNoActive = false;
          this.getCourseModulesByCourseId(res.id);
        } else {
          this.course.set({
            id: 0,
            personId: 0,
            startDate: '',
            endDate: '',
            status: ''
          });
          this.modules.set([]);
          this.showNoActive = true;
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
        this.modules.set(res);
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

  actionPlayClass(classId: number, classConfigId: number, currentImageId: number) {
    const dialogRef = this.dialog.open(ClassViewer, {
      data: { classConfigId: classConfigId, classId: classId, currentImageId: currentImageId },
      width: '90vw',           // 90% del ancho de la ventana
      height: '90vh',          // 90% del alto de la ventana
      maxWidth: '100vw',       // evita que se limite por defecto
      panelClass: 'full-dialog', // clase personalizada opcional
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.getCourseModulesByCourseId(this.course().id);
    });
  }

  actionViewExam(exam: Exam) {
    const dialogRef = this.dialog.open(ExamViewer, {
      data: { exam: exam },
      width: '90vw', 
      height: '90vh', 
      maxWidth: '100vw', 
      panelClass: 'full-dialog',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.getStudentCourseByPersonByAreaAndPractice();
      }
    });
  }

  isAnyClassNotViewed(classes: Lesson[]): boolean {
    let anyClassNotViewed = classes.find(c => c.viewed == false);
    if(anyClassNotViewed)
      return true;
    return false;
  }

}
