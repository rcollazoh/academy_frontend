import { Component, OnInit } from '@angular/core';
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
import { Nomenclators } from '../../../shared/services/nomenclators.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Routes } from '../../../shared/consts/routes';
import { Navbar } from "../../../layout/navbar/navbar";
import { Footer } from "../../../layout/footer/footer";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule, Navbar, Footer],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {

  form!: FormGroup;

  mostrarPassword = false;
  mostrarConfirm = false;

  listAreas: NomAreaDto[] = [];
  listPractice: NomPracticeDto[] = [];

  public routes: typeof Routes = Routes;

  constructor(private fb: FormBuilder, private authService: AuthService, private nomenclatorService: Nomenclators,
    private notificacionService: NotificationService, protected ngxLoaderService: NgxUiLoaderService, protected router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: new FormControl({ value: null, disabled: false }),
      isUser: [false],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
      id_number: ['', Validators.required],
      areaId: [{ value: null, disabled: false }, Validators.required],
      practiceId: [{ value: null, disabled: false }, Validators.required],
    },
      { validators: passwordMatchValidator });
    this.loadAreas();
  }

  loadAreas(): void {
    if (localStorage.getItem('listAreas') != null) {
      const areas = localStorage.getItem('listAreas');
      if (areas) {
        this.listAreas = JSON.parse(areas).listAreas;
      }
    } else {
      this.ngxLoaderService.startBackground("do-background-things");
      this.nomenclatorService.getAllAreas().subscribe({
        next: (res) => {
          this.listAreas = res;
          localStorage.setItem(
            'listAreas',
            JSON.stringify({
              listAreas: res,
            })
          );
          this.ngxLoaderService.stopBackground("do-background-things");
        },
        error: (err) => {
          this.ngxLoaderService.stopBackground("do-background-things");
          this.notificacionService.notificationError(
            'Lo sentimos, ocurrió un error al obtener las areas, recargue la página'
          );
        },
      });
    }
  }

  /**
   * Metodo para obtener practicas por area
   */
  getPracticeByArea(areaId: number): void {
    this.ngxLoaderService.startBackground("do-background-things");
    this.nomenclatorService.getPracticeByArea(areaId).subscribe({
      next: (res) => {
        this.listPractice = res;
        this.ngxLoaderService.stopBackground("do-background-things");
      },
      error: (err) => {
        this.ngxLoaderService.stopBackground("do-background-things");
        this.notificacionService.notificationError(
          'Lo sentimos, ocurrió un error al obtener las practicas, recargue la pagina'
        );
      },
    });
  }

  /**
   * Evento al seleccionar el area
   * @param event
   */
  onSelectArea(event: any) {
    this.getPracticeByArea(event);
  }

  onSubmit() {
    if (this.form.valid && this.form.value.password === this.form.value.confirm) {
      this.ngxLoaderService.start();

      let register = this.form.value;

      this.authService.registerPerson(register)
        .subscribe({
          next: (res) => {
            this.ngxLoaderService.stop();
            this.notificacionService.notificationSuccess(
              'Registro exitoso, inicie sesión con las credenciales creadas'
            );
            this.router.navigate([this.routes.HOME]);
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

}
