import { Component } from '@angular/core';
import {  EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';



@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    PanelMenuModule

],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent  implements OnInit{

    menuItems: MenuItem[] = [];
    menuStyle: any = {};

    constructor(private router: Router) {}

    ngOnInit() {
      this.updateMenuItems();
    }


    updateMenuItems() {
      this.menuItems = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          command: () => this.router.navigate(['/dashboard'])
        },
        {
          label: 'Pessoas',
          icon: 'pi pi-users',
          command: () => this.router.navigate(['/pessoas'])
        },
        {
          label: 'Cadastro',
          icon: 'pi pi-user-plus',
          command: () => this.router.navigate(['/cadastro'])
        },
        {
          label: 'Relatórios',
          icon: 'pi pi-chart-bar',
          items: [
            {
              label: 'Mensal',
              icon: 'pi pi-calendar',
              command: () => this.router.navigate(['/relatorios/mensal'])
            },
            {
              label: 'Anual',
              icon: 'pi pi-calendar-plus',
              command: () => this.router.navigate(['/relatorios/anual'])
            }
          ]
        },
        {
          label: 'Configurações',
          icon: 'pi pi-cog',
          command: () => this.router.navigate(['/configuracoes'])
        }
      ];
    }

}
