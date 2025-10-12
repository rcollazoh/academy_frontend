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

  constructor(private featuresService: FeaturesService, private dialog: MatDialog) {}

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
    return ['configCourseName', 'startDate', 'endDate', 'status', 'receiptUrl', /*'paymentMethod'*/];
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
}
