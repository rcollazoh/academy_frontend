import { Component, effect, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Question } from '../../models/course-model';
import { FeaturesService } from '../../../features/services/features.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioButton } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-exam-viewer',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatRadioButton],
  templateUrl: './exam-viewer.html',
  styleUrl: './exam-viewer.scss'
})
export class ExamViewer implements OnInit, OnDestroy{

  examId!: number;

  questions: Question[] = [];
  currentIndex = 0;
  selectedOptions: Record<number, number> = {}; // questionId -> optionId
  readonly timeLeft = signal(15 * 60); // 15 minutos en segundos
  
  timer!: ReturnType<typeof setInterval>;
  examFinished = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { examId: number },
    private featuresService: FeaturesService,
    protected ngxLoaderService: NgxUiLoaderService,
    private notificacionService: NotificationService,
    private dialogRef: MatDialogRef<ExamViewer>) {
    this.examId = this.data.examId;
    effect(() => {
    if (this.timeLeft() === 0) {
      this.examFinished = true;
    }
  });
  }

  ngOnInit(): void {
    this.getExamWithQuestionAndOptions(this.examId);
    this.startTimer();    
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  startTimer(): void {
  const interval = setInterval(() => {
    const current = this.timeLeft();
    if (current > 0) {
      this.timeLeft.set(current - 1);
    } else {
      clearInterval(interval);
      this.examFinished = true;
    }
  }, 1000);
}


  selectOption(questionId: number, optionId: number): void {
    this.selectedOptions[questionId] = optionId;
  }

  next(): void {
    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;
  }

  previous(): void {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  /*finishExam(): void {
    clearInterval(this.timer);
    const payload = Object.entries(this.selectedOptions).map(([questionId, optionId]) => ({
      questionId: +questionId,
      selectedOptionId: optionId
    }));
    this.featuresService.submitExamAnswers(this.data.examId, payload).subscribe(() => {
      this.examFinished = true;
    });
  }*/

  close(): void {
    this.dialogRef.close();
  }

  getExamWithQuestionAndOptions(examId: number): void {
    this.ngxLoaderService.start();
    this.featuresService.getExamWithQuestionAndOptions(examId).subscribe({
      next: (res) => {
        this.questions = res;
        this.ngxLoaderService.stop();
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          'Lo sentimos, ocurrió un error al obtener el examen'
        );
      },
    });
  }

}
