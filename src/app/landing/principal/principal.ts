import { Component } from '@angular/core';
import { Hero } from "../hero/hero";
import { CursosDestacadosComponent } from "../cursos-destacados/cursos-destacados";
import { VideoDestacado } from "../video-destacado/video-destacado";
import { Beneficios } from "../beneficios/beneficios";
import { Certificaciones } from "../certificaciones/certificaciones";
import { Navbar } from "../../layout/navbar/navbar";
import { Footer } from "../../layout/footer/footer";

@Component({
  selector: 'app-principal',
  imports: [Hero, CursosDestacadosComponent, Beneficios, Certificaciones, Navbar, Footer],
  templateUrl: './principal.html',
  styleUrl: './principal.scss'
})
export class Principal {

}
