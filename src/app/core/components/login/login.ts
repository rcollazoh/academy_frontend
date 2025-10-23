import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Footer } from '@/app/layout/footer/footer';
import { Navbar } from '@/app/layout/navbar/navbar';
import { Routes } from '@/app/shared/consts/routes';
import { LoginRequest } from '@/app/shared/models/login-request';
import { NotificationService } from '@/app/shared/services/notification.service';
import { AuthService } from '@/app/core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RecoverKey } from '../recover-key/recover-key';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    Navbar,
    Footer
],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'  
})
export class Login {
  mostrarPassword = false;
  public routes: typeof Routes = Routes;
  loginForm!: FormGroup;

  constructor(protected router: Router, private formBuilder: FormBuilder, protected ngxLoaderService: NgxUiLoaderService, 
    private authService: AuthService, private notificacionService: NotificationService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      user: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    
    const loginRequest: LoginRequest = {
      username: this.f['user'].value,
      password: this.f['password'].value
    };

    this.ngxLoaderService.start();
    this.authService.login(loginRequest).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.ngxLoaderService.stop();
          if(this.authService.user && this.authService.user.rol == 'STUDENT')
            this.router.navigate([this.routes.INICIO]);
          else
            this.router.navigate([this.routes.COURSES]);
          
        }, 1000);
      },
      error: (err) => {
        this.ngxLoaderService.stop();
         
          if(err && err.name=='HttpErrorResponse'){
            this.notificacionService.notificationError('Por favor, revise su conexión');
          } else if (err && err.error)
            this.notificacionService.notificationError(err.error);
          else {
            this.notificacionService.notificationError('Error al iniciar sesión');
          }
        
      },
    });
  }

  onAction() {
      
        const dialogRef = this.dialog.open(RecoverKey, {
          width: '420px',
          disableClose: true,
          data: {email: this.loginForm.get('user')?.valid ? this.loginForm.get('user')?.value : undefined }
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result?.success) {
            this.notificacionService.notificationSuccess('Se ha enviado una nueva clave a su correo electrónico');
          }
        });
      
    }

  
}

