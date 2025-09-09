import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-error-dialog',
  imports: [],
  templateUrl: './error-dialog.html',
  styleUrl: './error-dialog.scss'
})
export class ErrorDialog implements OnInit {
  title: string;
  message: string;

  closeModalSubscription: Subscription;

  constructor(public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogModel, private routeService: RouteService) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.closeModalSubscription = this.routeService.closeModals$.subscribe((closeModal: any) => {
      if (closeModal) {
        this.dialogRef.close(false);
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.closeModalSubscription) {
      this.closeModalSubscription.unsubscribe();
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
/**
* Class to represent information dialog model.
*
* It has been kept here to keep it as part of shared component.
*/
export class ErrorDialogModel {
  constructor(public title: string, public message: string) {
  }
}
