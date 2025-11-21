import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Module, StudentFeedback, StudentFeedbackModule } from '../../models/course-model';
import { FeaturesService } from '@/app/features/services/features.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from '../../services/notification.service';
import Swal from 'sweetalert2';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-feedback-viewer',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule, MatDialogModule, MatRadioModule, MatSelectModule, TranslatePipe
  ],
  templateUrl: './feedback-viewer.html',
  styleUrl: './feedback-viewer.scss'
})
export class FeedbackViewer implements OnInit {

  form!: FormGroup;
  group: any = {};
  modules: Module[];

  // Ratings traducibles
  ratings: string[] = [
    'FEEDBACKS.RATINGS.POOR',
    'FEEDBACKS.RATINGS.FAIR',
    'FEEDBACKS.RATINGS.GOOD',
    'FEEDBACKS.RATINGS.VERY_GOOD',
    'FEEDBACKS.RATINGS.EXCELLENT'
  ];

  // Aspectos traducibles
  aspects = [
    { label: 'FEEDBACKS.ASPECTS.PRESENTATION_STYLE', control: 'presentationStyle' },
    { label: 'FEEDBACKS.ASPECTS.COURSE_DURATION', control: 'courseDuration' },
    { label: 'FEEDBACKS.ASPECTS.OVERALL_SATISFACTION', control: 'overallSatisfaction' }
  ];

  // Preguntas traducibles
  questions = [
    { label: 'FEEDBACKS.QUESTION1', type: 'content' },
    { label: 'FEEDBACKS.QUESTION2', type: 'appearance' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FeedbackViewer>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private featuresService: FeaturesService,
    protected ngxLoaderService: NgxUiLoaderService,
    private notificacionService: NotificationService,
    private translate: TranslateService
  ) {
    this.modules = data.modules.filter((value: Module) =>
      value.moduleName !== 'Introducción' &&
      value.moduleName !== 'Referencias' &&
      value.moduleName !== 'Feedback'
    );
  }

  ngOnInit(): void {
    this.modules.forEach((element: Module) => {
      this.group['content-' + element.confingModuleId] = [null, Validators.required];
      this.group['appearance-' + element.confingModuleId] = [null, Validators.required];
    });

    this.aspects.forEach(a => this.group[a.control] = [null, Validators.required]);
    this.group.errors = [''];
    this.group.additionalComments = [''];
    this.form = this.fb.group(this.group);
  }

  submitFeedback(): void {
    const formValues = this.form.value as Record<string, string>;

    const feedbackList: StudentFeedbackModule[] = Object.entries(formValues)
      .filter(([key]) => key.startsWith('appearance-') || key.startsWith('content-'))
      .map(([key, value]) => {
        const [type, idStr] = key.split('-');
        const configModuleId = parseInt(idStr, 10);

        const questionObj = this.questions.find(q => q.type === type);
        return {
          configModuleId,
          evaluation: value,
          question: questionObj?.label ?? ''
        };
      });

    let feedback: StudentFeedback = {
      StudentModuleId: this.data.moduleId,
      learningQuestion: this.form.value.presentationStyle,
      durationQuestion: this.form.value.courseDuration,
      satisfactionQuestion: this.form.value.overallSatisfaction,
      errorObs: this.form.value.errors,
      considerationObs: this.form.value.additionalComments,
      modules: feedbackList
    };

    this.featuresService.submitFeedback(feedback).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationSuccess(
          this.translate.instant('FEEDBACKS.MESSAGES.SUCCESS')
        );

        if (res.courseStatus && res.courseStatus === 'APPROVED') {
          Swal.fire({
            title: this.translate.instant('FEEDBACKS.MESSAGES.INFO_TITLE'),
            html: '<div style="font-size: 1.4rem;text-align: center;"><strong>' +
              this.translate.instant('FEEDBACKS.MESSAGES.APPROVED') +
              '</strong></div>',
            icon: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: this.translate.instant('FEEDBACKS.MESSAGES.CONFIRM'),
            allowEscapeKey: false,
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              this.dialogRef.close(true);
              return;
            }
          });
        } else if (res.courseStatus && res.courseStatus === 'NOT_APPROVED') {
          Swal.fire({
            title: this.translate.instant('FEEDBACKS.MESSAGES.INFO_TITLE'),
            html: '<div style="font-size: 1.4rem;text-align: center;"><strong>' +
              this.translate.instant('FEEDBACKS.MESSAGES.NOT_APPROVED') +
              '</strong></div>',
            icon: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: this.translate.instant('FEEDBACKS.MESSAGES.CONFIRM'),
            allowEscapeKey: false,
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              this.dialogRef.close(true);
              return;
            }
          });
        } else {
          this.dialogRef.close(true);
        }
      },
      error: () => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          this.translate.instant('FEEDBACKS.MESSAGES.ERROR')
        );
      }
    });
  }

}
