import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RouteService } from '../../services/route.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
title: string;
  message: string;
  confirmBottom: boolean;
  confirmLabelBottom: string;
  dismissBottom:boolean;
  dismissLabelBottom:string;


  closeModalSubscription: Subscription;

  constructor(public dialogRef: MatDialogRef<ConfirmDialog>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,
              private routeService: RouteService) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;

    this.confirmBottom = data.confirmBottom;
    this.confirmLabelBottom = data.confirmLabelBottom;
    this.dismissBottom = data.dismissBottom;
    this.dismissLabelBottom = data.dismissLabelBottom;

    this.closeModalSubscription = this.routeService.closeModals$.subscribe(closeModal => {
      if (closeModal) {
        this.dialogRef.close(false);
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.closeModalSubscription){
      this.closeModalSubscription.unsubscribe();
    }
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmDialogModel {

  constructor(public title: string, public message: string,
              public confirmBottom: boolean, public confirmLabelBottom: string,
              public dismissBottom: boolean, public dismissLabelBottom: string) {
  }
}