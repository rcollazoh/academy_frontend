import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stateModulePipe'
})
export class StateModulePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let texto = '';

    if (value === 'NEW') {
      texto = 'Nuevo';
    } else if (value === 'ACTIVE') {
      texto = 'Activo'
    }  else if (value === 'APPROVED'){
      texto = 'Aprobado'
    } else if (value === 'NOT_APPROVED'){
      texto = 'No aprobado'
    }

    return texto;
  }

}
