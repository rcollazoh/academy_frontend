import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';
import { FeaturesService } from '../../../features/services/features.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-show-image',
  imports: [MatDialogModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './show-image.html',
  styleUrl: './show-image.scss'
})
export class ShowImage {

  imageUrl: SafeUrl | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { filename: string }, private featuresService: FeaturesService, protected ngxLoaderService: NgxUiLoaderService,) {
    this.loadPhoto(data.filename);
  }

  loadPhoto(rutaFoto: string): void {
    this.ngxLoaderService.start();
    if (rutaFoto !== null) {
      this.featuresService.getPhoto(rutaFoto).subscribe({
        next: (res) => {
          this.imageUrl = res;
          this.ngxLoaderService.stop();
        },
        error: (err) => {
          this.ngxLoaderService.stop();
          this.imageUrl = 'assets/images/no_photo.png';
        },
      });
    }
  }

}
