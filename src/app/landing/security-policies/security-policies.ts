import { Footer } from '@/app/layout/footer/footer';
import { Navbar } from '@/app/layout/navbar/navbar';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-security-policies',
  imports: [CommonModule, MatCardModule, Navbar, Footer],
  templateUrl: './security-policies.html',
  styleUrl: './security-policies.scss'
})
export class SecurityPolicies {

}
