import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { NomAreaDto } from '../../shared/models/nomenclator-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getAreaList(): HttpResourceRef<NomAreaDto[] | undefined> {
    return httpResource<NomAreaDto[]>(() => `${environment.serviceArea}`);
  }

  getPracticeList() {
    return httpResource(() => `${environment.serviceRegister}`);
  }

}