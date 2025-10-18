import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '@/app/shared/services/notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-recover-key',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule],
  templateUrl: './recover-key.html',
  styleUrl: './recover-key.scss'
})
export class RecoverKey implements OnInit {

  form!: FormGroup;
  fileError = '';
  compressedFile?: File;

  previewUrl: string | null = null;

  selectedFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecoverKey>, @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private notificacionService: NotificationService,
    protected ngxLoaderService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }


  cancelar() {
    this.dialogRef.close();
  }

  aceptar(): void {
    this.ngxLoaderService.start();
    this.authService.recoverKey(this.form.get('email')?.value).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        if(res && res.result){
          this.notificacionService.notificationError(
          res.result
        );
        } else
          this.dialogRef.close({ success: true });
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          'Lo sentimos, ocurrió un error al recuperar la clave'
        );
      },
    });
  }

}
