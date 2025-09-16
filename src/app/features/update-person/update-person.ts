import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OnExit } from '../../core/guards/exit-guard';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Routes } from '../../shared/consts/routes';
import { Observable, Subscription, take } from 'rxjs';
import { UserLogin } from '../../shared/models/user-model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from '../../shared/services/notification.service';
import { RouteService } from '../../shared/services/route.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { FeaturesService } from '../services/features.service';
import { ConfirmDialog, ConfirmDialogModel } from '../../shared/components/confirm-dialog/confirm-dialog';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { PersonEntity } from '../../shared/models/person-model';
import { ErrorDialog, ErrorDialogModel } from '../../shared/components/error-dialog/error-dialog';
import { Nomenclators } from '../../shared/services/nomenclators.service';
import { NomAreaDto, NomPracticeDto } from '../../shared/models/nomenclator-model';

@Component({
  selector: 'app-update-person',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule, RouterLink],
  templateUrl: './update-person.html',
  styleUrl: './update-person.scss'
})
export class UpdatePerson implements OnInit, OnDestroy, OnExit {

  userForm!: FormGroup;
  public routes: typeof Routes = Routes;

  selectedIndex = 0;

  personEditId!: number;

  lastRouteSubscription: Subscription;
  lastRoute = '';

  inputSwitchValue = false;

  @Input() personId: number = 0;

  hidePass = true;
  hideConfPass = true;
  ind: number = 0;

  ignoreCanDeactivate = false;

  public user$: Observable<UserLogin>;

  listAreas: NomAreaDto[] = [];
  listPractice: NomPracticeDto[] = [];

  constructor(
    private fb: FormBuilder,
    protected router: Router,
    protected ngxLoaderService: NgxUiLoaderService,
    private notificacionService: NotificationService,
    private route: ActivatedRoute,
    private routeService: RouteService,
    public dialog: MatDialog,
    private authService: AuthService,
    private featuresService: FeaturesService,
    private nomenclatorService: Nomenclators
  ) {

    this.user$ = this.authService.getUser();
    this.lastRouteSubscription = this.routeService.lastRoute$.subscribe(lastRoute => {
      if (lastRoute) {
        this.lastRoute = lastRoute;
      } else {
        this.lastRoute = '';
      }
    });

  }

  onExit() {

    if (this.userForm.dirty && this.ignoreCanDeactivate === false) {
      const dialogData = new ConfirmDialogModel('Información', '¿Seguro desea salir sin guardar los cambios?',
        true, 'Sí', true, 'No');

      const dialogRef = this.dialog.open(ConfirmDialog, {
        maxWidth: '400px',
        data: dialogData,
      });

      return dialogRef.afterClosed();
    }
    return true;
  }

  ngOnInit(): void {

    this.userForm = this.fb.group({
      name: new FormControl({ value: null, disabled: false}, Validators.required),
      lastName: new FormControl({ value: null, disabled: false}, Validators.required),
      email: new FormControl({ value: null, disabled: false}, Validators.compose([Validators.required, Validators.email])),
      phone: new FormControl({ value: null, disabled: false }),
      isUser: new FormControl({ value: false, disabled: false}),
      password: new FormControl({ value: '', disabled: false}, Validators.required),
      confirm: new FormControl({ value: '', disabled: false}, Validators.required),
      idNumber: new FormControl({ value: '', disabled: false}, Validators.required),
      areaId: new FormControl({ value: null, disabled: false}, Validators.required),
      practiceId: new FormControl({ value: null, disabled: false}, Validators.required),
    });

    var paramId = Number(this.route.snapshot.paramMap.get('id'));
    if (!paramId && this.personId) {
      paramId = Number(this.personId);
    }
    if (paramId) {
      this.personEditId = paramId;
      this.loadPersonData();
    }
    this.loadAreas();
  }

  ngOnDestroy(): void {

  }

  /**
   * Metodo para obtener los datos del usuario logueado y pasarlo en el formulario de creacion
   */
  getUserData(): any {
    let userData: any = undefined;
    const sub = this.user$
      .pipe(take(1))
      .subscribe((user: UserLogin) => (userData = user));
    sub.unsubscribe();
    return userData;
  }

  loadPersonData(): void {
    this.ngxLoaderService.start();
    this.featuresService.getPersonById(this.personEditId).subscribe({
      next: (res) => {

        this.userForm.patchValue(res);

        this.userForm.markAllAsTouched();


        this.userForm.controls['password'].clearValidators();
        this.userForm.controls['password'].setErrors(null);
        this.userForm.controls['confirm'].clearValidators();
        this.userForm.controls['confirm'].setErrors(null);

        this.ngxLoaderService.stop();

      },
      error: (err) => {
        this.ngxLoaderService.stop();
        this.notificacionService.notificationError(
          'Lo sentimos, ocurrió un error al cargar los datos del usuario'
        );
      },
    });
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

  createUser(): void {
    this.ngxLoaderService.start();

    let Dataperson = this.userForm.value;
    let persona: PersonEntity = Dataperson;

    this.featuresService
      .editPerson(persona, this.personEditId)
      .subscribe({
        next: (res) => {
          this.ignoreCanDeactivate = true;
          this.ngxLoaderService.stop();
          this.notificacionService.notificationSuccess(
            'Se actualizó el perfil correctamente.'
          );

        },
        error: (err) => {
          this.ngxLoaderService.stop();
          if (err) {
            if (err.name == 'HttpErrorResponse') {
              let msg = 'Revise su conexión.';
              const dialogData = new ErrorDialogModel('Error', msg);
              const dialogRef = this.dialog.open(ErrorDialog, {
                maxWidth: '400px',
                data: dialogData,
              });
            }
            else {
              const dialogData = new ErrorDialogModel('Error', err);
              const dialogRef = this.dialog.open(ErrorDialog, {
                maxWidth: '400px',
                data: dialogData,
              });
            }
          } else {
            let msg = 'Lo sentimos, ocurrió un error al modificar el perfil.';
            const dialogData = new ErrorDialogModel('Error', msg);
            const dialogRef = this.dialog.open(ErrorDialog, {
              maxWidth: '400px',
              data: dialogData,
            });
          }
        },
      });

  }



  validatePassword() {
    if (this.userForm.controls['password'].value && this.userForm.controls['confirm'].value &&
      (this.userForm.controls['password'].value !== this.userForm.controls['confirm'].value)) {
      let msg = '¡Las constraseñas escritas no son iguales!';
      const dialogData = new ConfirmDialogModel('Contraseñas Inválidas', msg,
        true, 'Aceptar', false, '');
      const dialogRef = this.dialog.open(ConfirmDialog, {
        maxWidth: '400px',
        data: dialogData,
      });

      dialogRef.afterClosed().subscribe((dialogResult) => {
        this.userForm.controls['password'].setValue(null);
        this.userForm.controls['confirm'].setValue(null);
      });
    }
  }

  mostrarErrores() {
    Object.keys(this.userForm.controls).forEach(control => {
      const formControl = this.userForm.controls[control];
      formControl.markAsTouched();
      formControl.markAsDirty();
    });
  }

  onInputChange(event: any): void {
    let input = event.target.value;
    input = input.replace(/\s+/g, ''); // Eliminar todos los espacios en blanco
    this.userForm.controls['phone'].setValue(input, { emitEvent: false });
  }

}
