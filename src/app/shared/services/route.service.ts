import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private lastRouteSource = new BehaviorSubject<any>(null);
  lastRoute$ = this.lastRouteSource.asObservable();

  private closeModalsSource = new Subject<boolean>();
  closeModals$ = this.closeModalsSource.asObservable();

  private reloadServiceSource = new Subject<boolean>();
  reloadService$ = this.reloadServiceSource.asObservable();

  constructor() { }

  saveLastRoute(urlAfterRedirects: any) {
    this.lastRouteSource.next(urlAfterRedirects)
  }

  closeAllModals(closeModals: boolean) {
    this.closeModalsSource.next(closeModals)
  }

  reloadService(reloadServivce: boolean) {
    this.reloadServiceSource.next(reloadServivce)
  }
}
