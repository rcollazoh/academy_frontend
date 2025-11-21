import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-certificaciones',
  imports: [MatButtonModule, RouterModule, MatIcon, TranslatePipe],
  templateUrl: './certificaciones.html',
  styleUrl: './certificaciones.scss'
})
export class Certificaciones {

}
