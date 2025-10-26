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
    CommonModule, MatDialogModule, MatRadioModule, MatSelectModule
  ],
  templateUrl: './feedback-viewer.html',
  styleUrl: './feedback-viewer.scss'
})
export class FeedbackViewer implements OnInit {

  form!: FormGroup;
  group: any = {};
  modules: Module[];
  ratings = ['Pobre', 'Aceptable', 'Bien', 'Muy bien', 'Excelente'];
  aspects = [
    { label: 'El estilo de presentación contribuyó a mi aprendizaje', control: 'presentationStyle' },
    { label: 'Me pareció adecuada la duración del curso electrónico', control: 'courseDuration' },
    { label: 'En general, el curso electrónico me pareció satisfactorio', control: 'overallSatisfaction' }
  ];

  questions = [
    { label: 'Califica el contenido de cada módulo', type: 'content' },
    { label: 'Califica la apariencia de cada módulo', type: 'appearance' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FeedbackViewer>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private featuresService: FeaturesService,
    protected ngxLoaderService: NgxUiLoaderService,
    private notificacionService: NotificationService,
  ) {
    this.modules = data.modules.filter((value: { moduleName: any; "": any; }) => value.moduleName !== 'Módulo 0: Introducción' && value.moduleName !== 'Referencias' && value.moduleName !== 'Feedback');
  }

  ngOnInit(): void {
    this.modules.forEach((element: { confingModuleId: number; }) => {
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
          'Se ha enviado el feedback correctamente'
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          'Lo sentimos, ocurrió un error al enviar el feedback, reintentelo'
        );
      },

    });
  }

}
