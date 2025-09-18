import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentWay'
})
export class PaymentWayPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let texto = '';

    if (value === 'TRANSF') {
      texto = 'Transferencia electrónica';
    } else if (value === 'SINPE') {
      texto = 'Sinpe Móvil'
    } 

    return texto;
  }

}
