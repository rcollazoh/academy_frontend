import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Routes } from '../../consts/routes';
import { Observable, take } from 'rxjs';
import { UserLogin } from '../../models/user-model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-app-user',
  imports: [MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './app-user.html',
  styleUrl: './app-user.scss'
})
export class AppUser {
  @Input() user: any;
  @Output() signOut: EventEmitter<void> = new EventEmitter<void>();
  public routes: typeof Routes = Routes;
  public user$: Observable<UserLogin>;

  constructor(protected router: Router, private authService: AuthService,) {
    this.user$ = this.authService.getUser();
  }

  public signOutEmit(): void {
    this.signOut.emit();
  }

  editPerson() {
    this.router.navigate([this.routes.EDIT_USER, this.getUserData().id]);
  }

  getUserData(): any {
    let userData: any = undefined;
    const sub = this.user$
      .pipe(take(1))
      .subscribe((user: UserLogin) => (userData = user));
    sub.unsubscribe();
    return userData;
  }

}
