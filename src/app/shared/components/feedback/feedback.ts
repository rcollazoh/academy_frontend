import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '@/app/core/services/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RecoverKey } from '@/app/core/components/recover-key/recover-key';
import {
  TranslateService,
    TranslatePipe,
    TranslateDirective
} from "@ngx-translate/core";

@Component({
  selector: 'app-feedback',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule, TranslatePipe],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss'
})
export class Feedback implements OnInit {
  private translate = inject(TranslateService);
  form!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecoverKey>, @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private notificacionService: NotificationService,
    protected ngxLoaderService: NgxUiLoaderService
  ) {
    
    this.translate.addLangs(['es', 'en']);
    this.translate.setFallbackLang('en');
    this.translate.use('en');
   }

  ngOnInit(): void {
    this.form = this.fb.group({
      personName: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      //email: ['', [Validators.required, Validators.email]],
    });
  }


  cancelar() {
    this.dialogRef.close();
  }

  aceptar(): void {
    this.ngxLoaderService.start();
    this.authService.sendFeedback(this.form.get('personName')?.value, this.form.get('message')?.value).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.dialogRef.close({ success: true });
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          'Lo sentimos, ocurrió un error al enviar su feedback'
        );
      },
    });
  }

}
