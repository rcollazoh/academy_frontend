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
export class ClassViewer implements OnInit {
  classConfigId!: number;
  classId!: number;
  currentImageId!: number;
  viewed!: boolean;
  imageData?: ClassImageNavigationDto;
  loading = true;
  safeResourcePhoto: SafeResourceUrl | String = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { classConfigId: number, classId: number, currentImageId: number, viewed: boolean },
    private featuresService: FeaturesService,
    protected ngxLoaderService: NgxUiLoaderService,
    private notificacionService: NotificationService,
    private dialogRef: MatDialogRef<ClassViewer>
  ) {
    this.classConfigId = this.data.classConfigId;
    this.classId = this.data.classId;
    this.currentImageId = this.data.currentImageId;
    this.viewed = this.data.viewed;
  }

  ngOnInit(): void {
    this.loadClass(this.classConfigId, this.currentImageId);
  }

  loadClass(id: number, currentImageId: number): void {
    this.ngxLoaderService.start();
    this.loading = true;
    this.featuresService.getClassWithNavigation(id, currentImageId).subscribe({
      next: (res) => {
        //this.ngxLoaderService.stop();
        this.imageData = res;
        if(!currentImageId)
          this.updateStatusClass(this.classId, this.viewed ? true : false, 1);
        else
          this.updateStatusClass(this.classId, this.viewed ? true : false, currentImageId);
        this.loadPhoto(this.imageData!.recourseUrl);
      },
      error: () => {
        this.ngxLoaderService.stop();
        this.loading = false;
      },
    });
  }

  loadImageNext(id: number, imageId: number): void {
    this.loading = true;
    this.ngxLoaderService.start();
    this.featuresService.getImageWithNavigation(id, imageId).subscribe({
      next: (res) => {
        this.imageData = res;
        if(this.imageData){
          if(this.imageData.nextId){
            this.updateStatusClass(this.classId, this.viewed ? true : false, imageId);
          } else {
            this.updateStatusClass(this.classId, true, 0);
          }
        } 
        this.loadPhoto(this.imageData!.recourseUrl);
      },
      error: () => {
        this.ngxLoaderService.stop();
        this.loading = false;
      },
    });
  }

  loadImagePrevious(id: number, imageId: number): void {
    this.loading = true;
    this.ngxLoaderService.start();
    this.featuresService.getImageWithNavigation(id, imageId).subscribe({
      next: (res) => {
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
      this.loadImageNext(this.classConfigId, this.imageData.nextId);
    }
  }

  previous(): void {
    if (this.imageData?.previousId) {
      this.loadImagePrevious(this.classConfigId, this.imageData.previousId);
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
          this.ngxLoaderService.stop();
          this.notificacionService.notificationError(
            'Ocurrió un error al obtener la imagen, no fue encontrada en el sistema'
          );
        },
      });
    }
  }

  updateStatusClass(classId: number, status: boolean, currentImageId: number): void {
      this.ngxLoaderService.startBackground();
  
      this.featuresService
        .updateClassStatus(classId, status, currentImageId)
        .subscribe({
          next: (res) => {
            this.ngxLoaderService.stopBackground();
          },
          error: (err) => {
            this.ngxLoaderService.stopBackground();
          },
        });  
    }

}
