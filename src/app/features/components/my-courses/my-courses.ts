import { Component, OnInit, signal } from '@angular/core';
import { FeaturesService } from '../../services/features.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PaymentWayPipe } from '../../../shared/pipes/payment-way-pipe';
import { StatePipe } from '../../../shared/pipes/state-pipe';
import { MatDialog } from '@angular/material/dialog';
import { ShowImage } from '../../../shared/components/show-image/show-image';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from '@/app/shared/services/notification.service';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, RouterModule, PaymentWayPipe, StatePipe, MatTooltipModule],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.scss'
})
export class MyCourses implements OnInit {
  lastRoute: string = '';
  routes = { INICIO: '/inicio' };
  courses = signal<any[]>([]);

  displayedColumns: string[] = [];

  constructor(private featuresService: FeaturesService, private dialog: MatDialog, protected ngxLoaderService: NgxUiLoaderService, private notificacionService: NotificationService,) { }

  ngOnInit(): void {
    this.displayedColumns = this.getDataColumnsTable();
    const userEncoded = localStorage.getItem('currentUser');
    if (userEncoded) {
      const user = JSON.parse(userEncoded).user;
      const userData = JSON.parse(atob(user));
      const personId = userData.id;
      this.getStudentCoursesByPerson(personId);
    }
  }

  getDataColumnsTable() {
    return ['configCourseName', 'area','practice','startDate', 'endDate', 'status', 'receiptUrl', 'certifyUrl' /*'paymentMethod'*/];
  }

  getStudentCoursesByPerson(personId: number): void {
    this.featuresService.getStudentCoursesByPerson(personId)
      .subscribe({
        next: (res) => {
          this.courses.set(res);
        },
        error: (err) => {
          console.error('Error al obtener cursos:', err);
        }
      });
  }

  openReceipt(filename: string): void {
    this.dialog.open(ShowImage, {
      data: { filename },
      width: '600px'
    });
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
          'Error al descargar el certificado'
        );
      }
    });
  }
}
