import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyField'
})
export class EmptyFieldPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    let texto = '';
    value ? (texto = value) : (texto = ' - ');
    return texto;
  }

}