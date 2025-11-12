import { Routes } from '@/app/shared/consts/routes';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cursos-destacados',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './cursos-destacados.html',
  styleUrl: './cursos-destacados.scss'
})
export class CursosDestacadosComponent {
  public routes: typeof Routes = Routes;
  cursos = signal([
    {
      titulo: 'Radiología',
      descripcion: 'Aplicar los principios fundamentales de seguridad para minimizar la exposición a radiaciones ionizantes en pacientes, operadores y público en general.',
      imagen: 'assets/images/radiologia.svg',
      link: ''
    },
    {
      titulo: 'Veterinaria',
      descripcion: 'Aplicar principios de seguridad para reducir la exposición del personal y optimizar el uso seguro de radiaciones ionizantes en las mascotas.',
      imagen: 'assets/images/veterinaria.svg',
      link: ''
    },
    {
      titulo: 'Odontología',
      descripcion: 'Limitar la exposición a radiación del paciente y del personal, mediante el uso seguro y justificado de procedimientos radiológicos.',
      imagen: 'assets/images/odontologia.svg',
      link: ''
    },
    {
      titulo: 'Radioterapia',
      descripcion: 'Garantizar la seguridad del paciente, del personal y del público, minimizando la exposición innecesaria durante el uso terapéutico con radiaciones ionizantes.',
      imagen: 'assets/images/radioterapia.svg',
      link: ''
    },
    {
      titulo: 'Medicina nuclear',
      descripcion: 'Controlar la exposición a radionúclidos mediante medidas específicas de seguridad en los procedimientos diagnósticos y terapéuticos.',
      imagen: 'assets/images/medicina_nuclear.svg',
      link: ''
    },
    {
      titulo: 'Industrial-Investigación',
      descripcion: 'Aplicar medidas de seguridad para controlar la exposición a radiaciones ionizantes durante el uso de fuentes radiactivas y equipos emisores.',
      imagen: 'assets/images/investigacion.svg',
      link: ''
    }    
  ]);

  constructor(private router: Router) {   
    
  }

  goToLogin() {
    this.router.navigate([this.routes.LOGIN]);
  }
}
