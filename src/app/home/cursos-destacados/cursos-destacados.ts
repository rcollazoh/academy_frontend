import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cursos-destacados',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './cursos-destacados.html',
  styleUrl: './cursos-destacados.scss'
})
export class CursosDestacadosComponent {
  cursos = signal([
    {
      titulo: 'Radiología Clínica',
      descripcion: 'Aprende a interpretar imágenes médicas con precisión.',
      imagen: 'assets/images/radiologia-clinica.png',
      link: '/cursos/radiologia'
    },
    {
      titulo: 'Tecnología Médica',
      descripcion: 'Aumenta el dominio de herramientas digitales aplicadas a la salud.',
      imagen: 'assets/images/tecnologia-medica.png',
      link: '/cursos/tecnologia'
    },
    {
      titulo: 'Anatomía Funcional',
      descripcion: 'Explora el cuerpo humano desde una perspectiva clínica.',
      imagen: 'assets/images/anatomia-funcional.png',
      link: '/cursos/anatomia'
    }
  ]);
}
