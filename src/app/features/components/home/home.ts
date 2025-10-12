import { Component, computed, OnInit, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { trigger, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { FeaturesService } from '../../services/features.service';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorDialog, ErrorDialogModel } from '../../../shared/components/error-dialog/error-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserLogin } from '../../../shared/models/user-model';
import { Observable, take } from 'rxjs';
import { Course } from '../../../shared/models/course-model';
import { EstadoCurso } from '../../../shared/consts/estado-curso';
import { ApplyCourseDialog, ApplyDialogModel } from '../../../shared/components/apply-course-dialog/apply-course-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, MatTooltipModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class Home implements OnInit {


  public user$: Observable<UserLogin>;

  course = signal<Course>({
    id: 0,
    personId: 0,
    course: undefined,
    startDate: '',
    endDate: '',
    status: ''
  });

  buttonLabel = computed(() => {
    switch (this.course()?.status) {
      case 'NEW': return 'Aplicar';
      case 'REJECTED': return 'Aplicar';
      default: return '';
    }
  });

  estadoMensaje = computed(() => {
    switch (this.course()?.status) {
      case 'NEW': return 'Debe seleccionar la opción aplicar para iniciar un nuevo curso.';
      case 'PENDING': return 'Pendiente a confirmar por el profesor.';
      case 'ACTIVATED': return 'El curso fue activado, puede comenzar las clases.';
      case 'REJECTED': return 'El curso fue rechazado por el profesor, debe aplicar al curso nuevamente.';
      default: return '';
    }
  });

  estado = computed(() => {
    switch (this.course()?.status) {
      case 'NEW': return EstadoCurso.NEW.toString();
      case 'PENDING': return EstadoCurso.PENDING.toString();
      case 'ACTIVATED': return EstadoCurso.ACTIVATED.toString();
      case 'REJECTED': return EstadoCurso.REJECTED.toString();
      default: return '';
    }
  });

  constructor(private featuresService: FeaturesService, protected router: Router,
    protected ngxLoaderService: NgxUiLoaderService, private authService: AuthService,
    public dialog: MatDialog) {
    this.user$ = this.authService.getUser();
  }

  ngOnInit(): void {
    this.getStudentCourseByPersonByAreaAndPractice();
  }

  onAction() {
    if (this.buttonLabel() === 'Aplicar') {
      const dialogData = new ApplyDialogModel(this.getUserData().id, this.course().course!.id.toString());
      const dialogRef = this.dialog.open(ApplyCourseDialog, {
        width: '420px',
        disableClose: true,
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.success) {
          this.course.update(c => ({ ...c, status: 'PENDING' }));
        }
      });
    }
  }

  /**
   * Metodo para obtener los datos del usuario logueado
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
        this.course.update(() => res);
        this.ngxLoaderService.stop();
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
}
