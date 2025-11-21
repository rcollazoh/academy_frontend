import { Routes } from '@/app/shared/consts/routes';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cursos-destacados',
  imports: [MatCardModule, MatButtonModule, TranslatePipe],
  templateUrl: './cursos-destacados.html',
  styleUrl: './cursos-destacados.scss'
})
export class CursosDestacadosComponent {
  public routes: typeof Routes = Routes;
  cursos = signal([
  { titulo: 'COURSES.RADIOLOGY.TITLE', descripcion: 'COURSES.RADIOLOGY.DESCRIPTION', imagen: 'assets/images/radiologia.svg', link: '' },
  { titulo: 'COURSES.VETERINARY.TITLE', descripcion: 'COURSES.VETERINARY.DESCRIPTION', imagen: 'assets/images/veterinaria.svg', link: '' },
  { titulo: 'COURSES.DENTISTRY.TITLE', descripcion: 'COURSES.DENTISTRY.DESCRIPTION', imagen: 'assets/images/odontologia.svg', link: '' },
  { titulo: 'COURSES.RADIOTHERAPY.TITLE', descripcion: 'COURSES.RADIOTHERAPY.DESCRIPTION', imagen: 'assets/images/radioterapia.svg', link: '' },
  { titulo: 'COURSES.NUCLEAR_MEDICINE.TITLE', descripcion: 'COURSES.NUCLEAR_MEDICINE.DESCRIPTION', imagen: 'assets/images/medicina_nuclear.svg', link: '' },
  { titulo: 'COURSES.INDUSTRIAL_RESEARCH.TITLE', descripcion: 'COURSES.INDUSTRIAL_RESEARCH.DESCRIPTION', imagen: 'assets/images/investigacion.svg', link: '' }
  ]);


  constructor(private router: Router) {   
    
  }

  goToLogin() {
    this.router.navigate([this.routes.LOGIN]);
  }
}
