import { Component, Inject, OnInit } from '@angular/core';
import { ClassImageNavigationDto } from '../../models/course-model';
import { FeaturesService } from '../../../features/services/features.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-class-viewer',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './class-viewer.html',
  styleUrl: './class-viewer.scss'
})
export class ClassViewer implements OnInit{
  classId!: number;
  imageData?: ClassImageNavigationDto;
  loading = true;
  safeResourcePhoto: SafeResourceUrl | String = '';

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: { classId: number },
  private featuresService: FeaturesService,
  protected ngxLoaderService: NgxUiLoaderService,
  private notificacionService: NotificationService,
  private dialogRef: MatDialogRef<ClassViewer>
) {
  this.classId = this.data.classId;
}

  ngOnInit(): void {
    this.loadClass(this.classId);
  }

  loadClass(id: number): void {
    this.ngxLoaderService.start();
    this.loading = true;
    this.featuresService.getClassWithNavigation(id).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.imageData = res;
        this.loadPhoto(this.imageData!.recourseUrl);
      },
      error: () => {
        this.ngxLoaderService.stop();
        this.loading = false;
      },
    });
  }

  loadImage(id: number, imageId:number): void {
    this.loading = true;
    this.ngxLoaderService.start();
    this.featuresService.getImageWithNavigation(id, imageId).subscribe({
      next: (res) => {
        this.ngxLoaderService.stop();
        this.imageData = res;
        this.loadPhoto(this.imageData!.recourseUrl);
      },
      error: () => {
        this.ngxLoaderService.stop();
        this.loading = false;
      },
    });
  }

  next(): void {
    if (this.imageData?.nextId) {
      this.loadImage(this.classId,this.imageData.nextId);
    }
  }

  previous(): void {
    if (this.imageData?.previousId) {
      this.loadImage(this.classId,this.imageData.previousId);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  loadPhoto(rutaFoto: string): void {
    this.safeResourcePhoto = '';
    if (rutaFoto !== null) {
      this.featuresService.getPhoto(rutaFoto).subscribe({
        next: (res) => {
          this.safeResourcePhoto = res;
          this.loading = false;
          this.ngxLoaderService.stop();
        },
        error: (err) => {
          this.loading = false;
           this.notificacionService.notificationError(
             'Ocurrió un error al obtener la imagen, no fue encontrada en el sistema'
           );
        },
      });
    }
  }
}
