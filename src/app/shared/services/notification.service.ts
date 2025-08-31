import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { ToastPosition } from '@ngneat/hot-toast';


@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toast: HotToastService, private _http: HttpClient) {}

  notificationWarningV2(mensaje: string, autoClose:boolean): void {
    const pos: ToastPosition = 'top-right';
    const opciones = {
      dismissible: true,
      autoClose: autoClose,
      position: pos,
      style: {
        background: '#fef3e7',
        marginTop: '75px',
      },
      iconTheme: {
        primary: '#f59e3f',
        secondary: '#fef3e7',
      },
    };

    const messageText = mensaje;

    const toastTemplate = `<div class="parrafo-oscuro">Alerta</div>
    <div>
      <p class="parrafo_small"
      style="flex-wrap: wrap !important;">${messageText}</p>
    </div>`;

    this.toast.warning(toastTemplate, opciones);
  }

  notificationWarning(mensaje: string): void {
    const pos: ToastPosition = 'top-right';
    const opciones = {
      dismissible: true,
      autoClose: true,
      position: pos,
      style: {
        background: '#fef3e7',
        marginTop: '75px',
      },
      iconTheme: {
        primary: '#f59e3f',
        secondary: '#fef3e7',
      },
    };

    const messageText = mensaje;

    const toastTemplate = `<div class="parrafo-oscuro">Mensaje de alerta</div>
    <div>
      <p class="parrafo_small"
      style="flex-wrap: wrap !important;">${messageText}</p>
    </div>`;

    this.toast.warning(toastTemplate, opciones);
  }

  notificationSuccess(mensaje: string): void {
    const pos: ToastPosition = 'top-right';
    const opciones = {
      dismissible: true,
      autoClose: true,
      position: pos,
      style: {
        background: '#f2f7e8',
        marginTop: '75px',
      },
      iconTheme: {
        primary: '#93c249',
        secondary: '#f2f7e8',
      },
    };

    const messageText = mensaje;

    const toastTemplate = `<div class="parrafo-oscuro">Mensaje de confirmación</div>
    <div>
      <p class="parrafo_small"
      style="flex-wrap: wrap !important;">${messageText}</p>
    </div>`;

    this.toast.success(toastTemplate, opciones);
  }

  notificationError(mensaje: string): void {
    const pos: ToastPosition = 'top-right';
    const opciones = {
      dismissible: true,
      autoClose: true,
      position: pos,
      style: {
        background: '#ffd6d7',
        marginTop: '75px',
      },
      iconTheme: {
        primary: '#ed3237',
        secondary: '#ffd6d7',
      },
    };

    const messageText = mensaje;

    const toastTemplate = `<div class="parrafo-oscuro"><strong>Mensaje de error</strong></div>
    <div>
      <p class="parrafo_small"
      style="flex-wrap: wrap !important;">${messageText}</p>
    </div>`;

    this.toast.error(toastTemplate, opciones);
  }

  notificationInfo(mensaje: string): void {
    const pos: ToastPosition = 'top-right';
    const opciones = {
      dismissible: true,
      autoClose: true,
      position: pos,
      style: {
        background: '#e0f2f6',
        marginTop: '75px',
      },
      iconTheme: {
        primary: '#0594b9',
        secondary: '#e0f2f6',
      },
    };

    const messageText = mensaje;

    const toastTemplate = `<div class="parrafo-oscuro">Mensaje informativo</div>
    <div>
      <p class="parrafo_small"
      style="flex-wrap: wrap !important;">${messageText}</p>
    </div>`;

    this.toast.info(toastTemplate, opciones);
  }

  
}