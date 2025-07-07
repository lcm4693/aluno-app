import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    MenubarModule,
    RouterModule,
    AvatarModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'Alunos',
      icon: 'pi pi-users',
      routerLink: '/listar',
    },
    {
      label: 'Calendário',
      icon: 'pi pi-calendar',
      routerLink: '/calendario-aulas',
    },
    // {
    //   label: 'Notificações',
    //   icon: 'pi pi-bell',
    //   command: () => {
    //     // abrir um overlayPanel ou navegação dedicada
    //   },
    // },
  ];
}
