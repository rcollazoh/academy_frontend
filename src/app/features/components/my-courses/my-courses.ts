import { Component, OnInit, signal } from '@angular/core';
import { FeaturesService } from '../../services/features.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PaymentWayPipe } from '../../../shared/pipes/payment-way-pipe';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, RouterModule, PaymentWayPipe],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.scss'
})
export class MyCourses implements OnInit {
  lastRoute: string = '';
  routes = { INICIO: '/inicio' };
  courses = signal<any[]>([]);

  constructor(private featuresService: FeaturesService) {}

  ngOnInit(): void {
    const userEncoded = localStorage.getItem('currentUser');
    if (userEncoded) {
      const user = JSON.parse(userEncoded).user;
      const userData = JSON.parse(atob(user));
      const personId = userData.id;
      this.getStudentCoursesByPerson(personId);
    }
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
}
