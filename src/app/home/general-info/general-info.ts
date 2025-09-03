import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-general-info',
  imports: [CommonModule, MatCardModule],
  templateUrl: './general-info.html',
  styleUrl: './general-info.scss'
})
export class GeneralInfo {

}
