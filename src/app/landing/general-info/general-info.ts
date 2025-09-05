import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Navbar } from "../../layout/navbar/navbar";
import { Footer } from "../../layout/footer/footer";

@Component({
  selector: 'app-general-info',
  imports: [CommonModule, MatCardModule, Navbar, Footer],
  templateUrl: './general-info.html',
  styleUrl: './general-info.scss'
})
export class GeneralInfo {

}
