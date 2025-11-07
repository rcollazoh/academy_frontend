import { Component, effect, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Exam, ExamResult, Question, QuestionOption } from '../../models/course-model';
import { FeaturesService } from '../../../features/services/features.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-exam-viewer',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatRadioModule],
  templateUrl: './exam-viewer.html',
  styleUrl: './exam-viewer.scss'
})
export class ExamViewer implements OnInit, OnDestroy {

  examId!: number;
  examConfigId!: number;
  time!: number;

  questions: Question[] = [];
  currentIndex = 0;
  selectedOptions: Record<number, number> = {}; // questionId -> optionId
  readonly timeLeft = signal(5 * 60); // 15 minutos en segundos

  timer!: ReturnType<typeof setInterval>;

  examResult: ExamResult[] = [];

  radioButtonDisable: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { exam: Exam },
    private featuresService: FeaturesService,
    protected ngxLoaderService: NgxUiLoaderService,
    private notificacionService: NotificationService,
    private dialogRef: MatDialogRef<ExamViewer>) {
    this.examId = this.data.exam.id;
    this.examConfigId = this.data.exam.configExamId;
    this.time = this.data.exam.durationMinutes;
    this.timeLeft.set(this.time * 60);
    effect(() => {
      if (this.timeLeft() === 0) {
        this.finishExam();
      }
    });
  }

  ngOnInit(): void {
    this.getExamWithQuestionAndOptions(this.examConfigId, this.data.exam.questions);
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      const current = this.timeLeft();
      if (current > 0) {
        this.timeLeft.set(current - 1);
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }


  selectOption(questionId: number, optionId: number): void {
    this.selectedOptions[questionId] = optionId;
  }

  next(): void {
    this.ngxLoaderService.start();
    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;
    this.ngxLoaderService.stop();
  }

  previous(): void {
    this.ngxLoaderService.start();
    if (this.currentIndex > 0) this.currentIndex--;
    this.ngxLoaderService.stop();
  }

  finishExam(): void {
    clearInterval(this.timer);
    let payload = Object.entries(this.selectedOptions).map(([questionId, optionId]) => ({
      questionId: +questionId,
      optionId: optionId
    }));

    payload.forEach(element => {
      let question = this.questions.find(q => q.id == element.questionId);
      let option = question?.configOptions.find(o => o.id == element.optionId);
      let exam: ExamResult = {
        questionId: element.questionId,
        optionId: element.optionId,
        isCorrect: option?.isCorrect
      }
      this.examResult.push(exam);
    });

    this.ngxLoaderService.start();

    this.featuresService.submitExamAnswers(this.data.exam.id, this.examResult).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.radioButtonDisable = true;

        if (res.courseStatus == 'APPROVED') {
          Swal.fire({
            title: '¡Información!',
            html: '<div style="font-size: 1.4rem;text-align: center;"><strong>' + 'Felicidades! Usted ha aprobado el curso satisfactoriamente. PRAD ACADEMY en el transcurso de las próximas 48 horas subirá su certificado, revisar el menú Mis cursos.' + '</strong></div>',
            icon: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
            allowEscapeKey: false,
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              return;
            }
          })
        } else if (res.courseStatus == 'NOT_APPROVED'){

          Swal.fire({
            title: '¡Información!',
            html: '<div style="font-size: 1.4rem;text-align: center;"><strong>' + 'Lamentamos informarle que usted ha desaprobado el curso. Póngase en contacto con PRAD ACADEMY.' + '</strong></div>',
            icon: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
            allowEscapeKey: false,
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              return;
            }
          })

        } else {

          Swal.fire({
            title: '¡Información!',
            html: '<div style="font-size: 1.4rem;text-align: center;"><strong>' + 'El examen del módulo ha terminado' + '</strong></div><div style="font-size: 1.4rem;text-align: center;"><strong>Resultado: ' + (res.examStatus == 'APPROVED' ? 'APROBADO' : 'NO APROBADO') + '</strong><div>',
            icon: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
            allowEscapeKey: false,
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              return;
            }
          })

        }

      },
      error: (err) => {
        this.examResult = [];
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          'Lo sentimos, ocurrió un error al finalizar el exámen, reintentelo'
        );
      },

    });
  }

  close(): void {
    this.dialogRef.close(true);
  }

  getExamWithQuestionAndOptions(examId: number, totalQuestions: number): void {
    this.ngxLoaderService.start();
    this.featuresService.getExamWithQuestionAndOptions(examId, totalQuestions).subscribe({
      next: (res) => {
        this.questions = res;
        this.ngxLoaderService.stop();
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          'Lo sentimos, ocurrió un error al obtener el exámen'
        );
      },
    });
  }

  isSelected(question: Question, option: QuestionOption): boolean {
    if (!this.examResult.length)
      return false;
    let examQuestion = this.examResult.find(exam => exam.questionId == question.id);
    if (examQuestion && examQuestion?.optionId == option.id)
      return true;
    return false;
  }

  buttonFinishDisable(): boolean{
    let payload = Object.entries(this.selectedOptions).map(([questionId, optionId]) => ({
      questionId: +questionId,
      optionId: optionId
    }));
    if(payload.length && payload.length == this.data.exam.questions){
      return false;
    }
    return true;
  }

}
