import { Component, OnInit,inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { passwordMatchValidator } from '../../../shared/validators/validators';
import { NomAreaDto, NomPracticeDto } from '../../../shared/models/nomenclator-model';
import { NotificationService } from '../../../shared/services/notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Footer } from '@/app/layout/footer/footer';
import { Navbar } from '@/app/layout/navbar/navbar';
import { Routes } from '@/app/shared/consts/routes';
import { LoginRequest } from '@/app/shared/models/login-request';
import { Nomenclators } from '@/app/shared/services/nomenclators.service';
import {
  TranslateService,
    TranslatePipe,
    TranslateDirective
} from "@ngx-translate/core";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule, Navbar, Footer, TranslatePipe],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
 private translate = inject(TranslateService);
  form!: FormGroup;

  mostrarPassword = false;
  mostrarConfirm = false;

  listAreas: NomAreaDto[] = [];
  listPractice: NomPracticeDto[] = [];

  public routes: typeof Routes = Routes;

  constructor(private fb: FormBuilder, private authService: AuthService, private nomenclatorService: Nomenclators,
    private notificacionService: NotificationService, protected ngxLoaderService: NgxUiLoaderService, protected router: Router
  ) { 
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: new FormControl({ value: null, disabled: false }),
      isUser: [false],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
      idNumber: ['', Validators.required],
    },
      { validators: passwordMatchValidator });
  }


  onSubmit() {
    if (this.form.valid && this.form.value.password === this.form.value.confirm) {
      this.ngxLoaderService.start();

      let register = this.form.value;

      this.authService.registerPerson(register)
        .subscribe({
          next: (res) => {
            this.ngxLoaderService.stop();
            this.login();
          },
          error: (err) => {
            this.ngxLoaderService.stop();
            this.notificacionService.notificationError(
              'Lo sentimos, ocurrió un error en el registro: ' + err
            );
          },
        });
    } else {
      this.form.get('confirm')?.setErrors({ mismatch: true });
    }
  }

  login() {
    const loginRequest: LoginRequest = {
      username: this.form.controls['email'].value,
      password: this.form.controls['password'].value
    };

    this.ngxLoaderService.start();
    this.authService.login(loginRequest).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.ngxLoaderService.stop();
          this.router.navigate([this.routes.INICIO]);
        }, 1000);
      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.router.navigate([this.routes.HOME]);
      },
    });
  }

}
