import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statePipe'
})
export class StatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let texto = '';

    if (value === 'NEW') {
      texto = 'Nuevo';
    } else if (value === 'PENDING') {
      texto = 'Pendiente'
    } else if (value === 'ACTIVATED') {
      texto = 'Activado'
    } else if (value === 'REJECTED') {
      texto = 'Rechazado'
    } else if (value === 'APPROVED'){
      texto = 'Aprobado'
    } else if (value === 'NOT_APPROVED'){
      texto = 'No aprobado'
    }

    return texto;
  }

}
