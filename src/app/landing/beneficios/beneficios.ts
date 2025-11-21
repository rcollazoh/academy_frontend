import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { TranslatePipe } from '@ngx-translate/core';

register(); // Registra los Web Components de Swiper

@Component({
  selector: 'app-beneficios',
  imports: [MatCardModule, MatIconModule, TranslatePipe],
  templateUrl: './beneficios.html',
  styleUrl: './beneficios.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Beneficios {
  beneficios = signal([
    { icono: 'query_builder', titulo: 'BENEFITS.FLEXIBILITY.TITLE', texto: 'BENEFITS.FLEXIBILITY.TEXT' },
    { icono: 'track_changes', titulo: 'BENEFITS.PACE.TITLE', texto: 'BENEFITS.PACE.TEXT' },
    { icono: 'stay_current_portrait', titulo: 'BENEFITS.ACCESS.TITLE', texto: 'BENEFITS.ACCESS.TEXT' },
    { icono: 'support_agent', titulo: 'BENEFITS.SUPPORT.TITLE', texto: 'BENEFITS.SUPPORT.TEXT' },
    { icono: 'calendar_month', titulo: 'BENEFITS.TIME.TITLE', texto: 'BENEFITS.TIME.TEXT' },
    { icono: 'follow_the_signs', titulo: 'BENEFITS.COMPATIBILITY.TITLE', texto: 'BENEFITS.COMPATIBILITY.TEXT' },
    { icono: 'class', titulo: 'BENEFITS.LEADERSHIP.TITLE', texto: 'BENEFITS.LEADERSHIP.TEXT' },
    { icono: 'work', titulo: 'BENEFITS.PROFESSIONAL.TITLE', texto: 'BENEFITS.PROFESSIONAL.TEXT' },
    { icono: 'model_training', titulo: 'BENEFITS.SMART.TITLE', texto: 'BENEFITS.SMART.TEXT' },
    { icono: 'verified', titulo: 'BENEFITS.CERTIFICATION.TITLE', texto: 'BENEFITS.CERTIFICATION.TEXT' }
  ]);

}
