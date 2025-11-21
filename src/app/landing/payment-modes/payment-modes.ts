import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-modes',
  imports: [TranslatePipe],
  templateUrl: './payment-modes.html',
  styleUrl: './payment-modes.scss'
})
export class PaymentModes {

}
