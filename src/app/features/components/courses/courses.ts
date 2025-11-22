import { Component, OnInit } from '@angular/core';
import { Routes } from '../../../shared/consts/routes';
import { Course } from '../../../shared/models/course-model';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, Subscription, take } from 'rxjs';
import { CourseRequest } from '../../../shared/models/course-request-model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RouteService } from '../../../shared/services/route.service';
import { AuthService } from '../../../core/services/auth.service';
import { FeaturesService } from '../../services/features.service';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from "@angular/material/card";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { EmptyFieldPipe } from "../../../shared/pipes/empty-field-pipe";
import { StatusDto } from '../../../shared/models/nomenclator-model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatePipe } from "../../../shared/pipes/state-pipe";
import { PaymentWayPipe } from "../../../shared/pipes/payment-way-pipe";
import { UserLogin } from '../../../shared/models/user-model';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-courses',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatCardModule, MatTableModule, MatSortModule, MatPaginatorModule, EmptyFieldPipe, CommonModule, MatButtonModule,
    RouterLink, MatIconModule, MatTooltipModule, PaymentWayPipe, StatePipe, TranslatePipe],
  templateUrl: './courses.html',
  styleUrl: './courses.scss'
})
export class Courses implements OnInit {

  public user$: Observable<UserLogin>;

  displayedColumns: string[] = [];

  length = 0;
  pageSize = 15;
  pageIndex = 0;
  selectedRowIndex = 0;

  status: string | undefined;

  public routes: typeof Routes = Routes;

  courseList: Course[] = [];
  courseSelected!: Course | undefined;
  selection = new SelectionModel<Course>(false, []);

  lastRouteSubscription: Subscription;
  lastRoute = '';
  statusList: StatusDto[] = [];

  courseRequest: CourseRequest = {
    id: undefined,
    status: undefined,
    courseName: undefined
  }

  /** Sort State */
  active: string = 'id';
  direction: string = 'desc';

  selectedFileName: string = '';

  constructor(private featuresService: FeaturesService,
    protected ngxLoaderService: NgxUiLoaderService,
    private notificacionService: NotificationService,
    protected router: Router,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private routeService: RouteService,
    private authService: AuthService,
    private translate: TranslateService) {
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
    this.displayedColumns = this.getDataColumnsTable();
    this.statusList = [
      { id: 0, name: 'NEW', description: 'COURSE_LIST.STATUS_NEW' },
      { id: 1, name: 'PENDING', description: 'COURSE_LIST.STATUS_PENDING' },
      { id: 2, name: 'ACTIVATED', description: 'COURSE_LIST.STATUS_ACTIVATED' },
      { id: 3, name: 'REJECTED', description: 'COURSE_LIST.STATUS_REJECTED' },
      { id: 4, name: 'APPROVED', description: 'COURSE_LIST.STATUS_APPROVED' },
      { id: 5, name: 'NOT_APPROVED', description: 'COURSE_LIST.STATUS_NOT_APPROVED' }
    ];



    this.getCourses(this.courseRequest, this.pageIndex, this.pageSize);
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

  getDataColumnsTable() {
    return ['personName', 'personLastName', 'personEmail', 'courseName', 'area', 'practice', 'status', 'certifyUrl' /*'paymentMethod'*/];
  }

  getCourses(request: CourseRequest, pageNumber: number, pageSize: number): void {
    this.ngxLoaderService.start();
    this.featuresService.getCourses(request, pageNumber, pageSize, this.active + ',' + this.direction).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.courseList = res.result.elements;
        this.length = res.result.count;

        this.courseSelected = undefined;
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          this.translate.instant('COURSE_LIST.ERROR_LOAD')
        );
      },
    });
  }

  loadCourseList(): void {
    this.getCourses(this.courseRequest, this.pageIndex, this.pageSize);
  }

  activeCourse() {
    this.ngxLoaderService.start();
    this.featuresService.activeCourse(this.courseSelected?.personId, this.courseSelected?.id).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationSuccess(
          this.translate.instant('COURSE_LIST.ACTIVATE_SUCCESS')
        );
        this.getCourses(this.courseRequest, this.pageIndex, this.pageSize);
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          this.translate.instant('COURSE_LIST.ACTIVATE_ERROR')
        );
      },
    });
  }

  rejectCourse() {
    this.ngxLoaderService.start();
    this.featuresService.rejectCourse(this.courseSelected?.personId, this.courseSelected?.id).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationSuccess(
          this.translate.instant('COURSE_LIST.REJECT_SUCCESS')
        );
        this.getCourses(this.courseRequest, this.pageIndex, this.pageSize);
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          this.translate.instant('COURSE_LIST.REJECT_ERROR')
        );
      },
    });
  }

  reactivateStudentCourse() {
    this.ngxLoaderService.start();
    this.featuresService.reactivateStudentCourse(this.courseSelected?.personId, this.courseSelected?.id).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationSuccess(
          this.translate.instant('COURSE_LIST.REACTIVATE_SUCCESS')
        );
        this.getCourses(this.courseRequest, this.pageIndex, this.pageSize);
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          this.translate.instant('COURSE_LIST.REACTIVATE_ERROR')
        );
      },
    });
  }

  setSelectedRow(row: Course, event: MouseEvent): void {
    if (this.courseSelected != row) {
      this.selection.toggle(row);
      this.courseSelected = row;
    }
  }


  tableKeydown(event: KeyboardEvent) {
    if (!this.selection.isEmpty()) {
      let newSelection;
      const currentSelection = this.selection.selected[0];
      const currentIndex = this.courseList.findIndex(row => row === currentSelection);
      this.selectedRowIndex = currentIndex;
      if (event.key === 'ArrowDown') {
        newSelection = this.courseList[currentIndex + 1];
        this.selectedRowIndex = currentIndex + 1;
      } else if (event.key === 'ArrowUp') {
        newSelection = this.courseList[currentIndex - 1];
        this.selectedRowIndex = currentIndex - 1;
      }
      if (newSelection) {
        this.selection.toggle(newSelection);
        this.courseSelected = newSelection;
      }
    }
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getCourses(this.courseRequest, this.pageIndex, this.pageSize);
  }

  searchByStatus(event?: any) {
    if (event !== 0) {
      this.courseRequest.status = event;
    } else {
      this.courseRequest.status = undefined;
    }
    this.pageIndex = 0;
    this.pageSize = 15;
    this.getCourses(this.courseRequest, this.pageIndex, this.pageSize);
  }

  downloadCertify(filename: string): void {
    this.ngxLoaderService.start();
    this.featuresService.downloadCertify(filename).subscribe({
      next: (blob) => {
        this.ngxLoaderService.stop();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          this.translate.instant('COURSE_LIST.DOWNLOAD_ERROR')
        );
      }
    });
  }


  onFileSelected(event: Event): void {
    this.ngxLoaderService.start();
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      this.ngxLoaderService.stop();
      return;
    }

    const file = input.files[0];
    if (file.type !== 'application/pdf') {
      this.ngxLoaderService.stop();
      this.notificacionService.notificationError(
        this.translate.instant('COURSE_LIST.PDF_ONLY')
      );
      input.value = '';
      return;
    }

    this.featuresService.uploadCertify(this.courseSelected?.personId!, this.courseSelected?.id!, file).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationSuccess(
          this.translate.instant('COURSE_LIST.IMPORT_SUCCESS')
        );
        input.value = '';
        this.getCourses(this.courseRequest, this.pageIndex, this.pageSize);
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          this.translate.instant('COURSE_LIST.IMPORT_ERROR')
        );
        input.value = '';
      },
    });
  }

}
