import { Component, OnInit, signal, Signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { Menu } from '../../models/menu-model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, MatNavList, MatListItem, MatExpansionModule, CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  providers: [provideNativeDateAdapter()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Sidebar implements OnInit {

  menuList!: Signal<Menu[]>;

  ngOnInit(): void {
    this.menuList = this.getList();
  }

  //Json del menu
  getList(): Signal<Menu[]> {
    let menuList: Menu[] = [];

    menuList = [
        {
          text: 'Información',
          icon: 'dashboard',
          routerLink: '/app/inicio'
        },
        {
          text: 'Mis cursos',
          icon: 'book',
          routerLink: '/app/courses'
        },
        {
          text: 'Curso actual',
          icon: 'local_taxi',
          routerLink: '/app/courses'
        },
        {
          text: 'Cerrar sesión',
          icon: 'group',
          routerLink: '/app/courses'
        },
      ]
    
  
    return signal(menuList);
  }

  onMenuClick(menu: string): void {
    if (menu === 'Cerrar sesión') {
      //this.openDialog();
    }
  }
  

}
