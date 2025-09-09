import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-app-user',
  imports: [MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './app-user.html',
  styleUrl: './app-user.scss'
})
export class AppUser {
  @Input() user: any;
  @Output() signOut: EventEmitter<void> = new EventEmitter<void>();

  constructor(){
    
  }

  public signOutEmit(): void {
    this.signOut.emit();
  }
  
}
