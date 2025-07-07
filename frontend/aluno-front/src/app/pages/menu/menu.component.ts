import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { UserStoreService } from '../../auth/services/user-store.service';

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
export class MenuComponent implements OnInit {
  constructor(private userStorage: UserStoreService) {}
  items: { label: string; icon: string; routerLink: string }[] | undefined =
    undefined;

  ngOnInit(): void {
    this.items = [
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
    const isAdmin = this.userStorage.getUsuario()?.isAdmin;

    if (isAdmin) {
      this.items.push({
        label: 'Cadastrar usuário',
        icon: 'pi pi-user-plus',
        routerLink: '/cadastrar-usuario',
      });
    }
  }
}
