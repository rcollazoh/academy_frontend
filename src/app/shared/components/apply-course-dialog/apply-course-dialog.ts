import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import imageCompression from 'browser-image-compression';
import { MatIconModule } from "@angular/material/icon";
import { FeaturesService } from '../../../features/services/features.service';
import { NotificationService } from '../../services/notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-apply-course-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
],
  templateUrl: './apply-course-dialog.html',
  styleUrl: './apply-course-dialog.scss'
})
export class ApplyCourseDialog implements OnInit {

  form!: FormGroup;
  fileError = '';
  compressedFile?: File;

  previewUrl: string | null = null;

  selectedFileName: string = '';

  metodos = [
    { value: 'TRANSF', label: 'Transferencia electrónica' },
    { value: 'SINPE', label: 'Sinpe Móvil' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ApplyCourseDialog>, @Inject(MAT_DIALOG_DATA) public data: ApplyDialogModel,
    private featuresService: FeaturesService,
    private notificacionService: NotificationService,
    protected ngxLoaderService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      metodo: ['', Validators.required],
      imagen: [null, Validators.required]
    });
  }

  async onFileSelected(event: Event) {
    this.ngxLoaderService.start();
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      this.ngxLoaderService.stop();
      return;
    }

    this.selectedFileName = file.name;

    if (file.size > 2 * 1024 * 1024) {
      this.ngxLoaderService.stop();
      this.fileError = 'La imagen no debe superar los 2MB';
      return;
    }

    try {
      const options = { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: true };
      this.compressedFile = await imageCompression(file, options);
      this.fileError = '';
      this.form.patchValue({ imagen: this.compressedFile });

      // Generar previsualización
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.compressedFile);

      this.ngxLoaderService.stop();

    } catch {
      this.ngxLoaderService.stop();
      this.fileError = 'Error al comprimir la imagen';
    }
  }


  cancelar() {
    this.dialogRef.close();
  }

  aceptar() {
    if (this.form.invalid || !this.compressedFile) return;

    this.ngxLoaderService.start();

    const formData = new FormData();
    formData.append('personId', this.data.personId);
    formData.append('courseId', this.data.courseId);
    formData.append('paymentMethod', this.form.value.metodo!);
    formData.append('payment', this.compressedFile);

    this.featuresService.addPhoto(formData).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.dialogRef.close({ success: true });
        this.notificacionService.notificationSuccess('Ha aplicado al curso correctamente, espere por la confirmación del profesor');
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError('Error al aplicar al curso.');   
      },
    });
  }

}

/**
* Class to represent information dialog model.
*
* It has been kept here to keep it as part of shared component.
*/
export class ApplyDialogModel {
  constructor(public personId: string, public courseId: string) {
  }
}