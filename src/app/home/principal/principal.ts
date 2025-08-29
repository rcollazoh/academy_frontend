import { Component } from '@angular/core';
import { Hero } from "../hero/hero";
import { CursosDestacadosComponent } from "../cursos-destacados/cursos-destacados";
import { VideoDestacado } from "../video-destacado/video-destacado";
import { Beneficios } from "../beneficios/beneficios";
import { Certificaciones } from "../certificaciones/certificaciones";

@Component({
  selector: 'app-principal',
  imports: [Hero, CursosDestacadosComponent, VideoDestacado, Beneficios, Certificaciones],
  templateUrl: './principal.html',
  styleUrl: './principal.scss'
})
export class Principal {

}
