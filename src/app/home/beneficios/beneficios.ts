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
      icono: 'query_builder',
      titulo: 'Flexibilidad de horario',
      texto: 'Puedes acceder al contenido en el momento que te resulte más conveniente, sin depender de horarios fijos.'
    },
    {
      icono: 'track_changes',
      titulo: 'Ritmo personalizado',
      texto: 'Avanzas a tu propio ritmo, repitiendo o pausando los contenidos cuando lo necesites.'
    },
    {
      icono: 'stay_current_portrait',
      titulo: 'Acceso desde cualquier lugar',
      texto: 'Solo necesitas conexión a internet y un dispositivo (computadora, tableta, celular).'
    },
    {
      icono: 'support_agent',
      titulo: 'Soporte académico disponible 24/7',
      texto: 'Acompañamiento personalizado durante todo el curso.'
    },
    {
      icono: 'calendar_month',
      titulo: 'Optimización del tiempo',
      texto: 'Puedes usar incluso pequeños momentos libres para avanzar durante los días de acceso.'
    },
    {
      icono: 'follow_the_signs',
      titulo: 'Compatibilidad con el trabajo y la vida personal',
      texto: 'Se adapta fácilmente a su rutina, permitiendo equilibrar mejor su aprendizaje, trabajo y vida social.'
    },
    {
      icono: 'class',
      titulo: 'Fomenta su liderazgo y autonomía',
      texto: 'Te ayuda a organizar su tiempo, mejorar su disciplina y ser más responsable con su aprendizaje.'
    },
    {
      icono: 'work',
      titulo: 'Enfoque profesional orientado al entorno laboral',
      texto: 'Te ofrece una formación integral y actualizada. Se prioriza la aplicación directa de los principios de protección radiológica en escenarios cotidianos.'
    },
    {
      icono: 'model_training',
      titulo: 'Contenido integral e inteligente de aprendizaje',
      texto: 'Diseñado mediante IA, revisado y actualizado por un profesional con varios años de experiencia.'
    },
    {
      icono: 'verified',
      titulo: 'Certificación',
      texto: 'Ideal para CV profesional, recertificación y/o cumplimiento normativo.'
    }
  ]);
}
