import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-beneficios',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './beneficios.html',
  styleUrl: './beneficios.scss'
})
export class Beneficios {
  beneficios = signal([
    {
      icono: 'support_agent',
      titulo: 'Soporte docente',
      texto: 'Acompañamiento personalizado durante todo el curso.'
    },
    {
      icono: 'track_changes',
      titulo: 'Avance y seguimiento',
      texto: 'Monitorea tu progreso con reportes y evaluaciones.'
    },
    {
      icono: 'verified',
      titulo: 'Certificación',
      texto: 'Obtén un diploma reconocido por instituciones médicas.'
    }
  ]);
}
