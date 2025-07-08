import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { UserStoreService } from '../../auth/services/user-store.service';
import { Usuario } from '../../models/usuario';

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
  items: any[] | undefined = undefined;

  usuario: Usuario | undefined;

  ngOnInit(): void {
    this.usuario = this.userStorage.getUsuario()!;

    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/',
      },
      {
        label: 'Alunos',
        icon: 'pi pi-users',
        items: [
          { label: 'Listar', routerLink: '/listar' },
          { label: 'Cadastrar', routerLink: '/alunos/cadastrar' },
        ],
      },
      {
        label: 'Calendário',
        icon: 'pi pi-calendar',
        routerLink: '/aulas/calendario',
      },
      {
        label: 'Aulas',
        icon: 'pi pi-calendar',
        items: [
          { label: 'Buscar anotações', routerLink: '/aulas/buscar-anotacoes' },
        ],
      },
      // {
      //   label: 'Notificações',
      //   icon: 'pi pi-bell',
      //   command: () => {
      //     // abrir um overlayPanel ou navegação dedicada
      //   },
      // },
    ];

    if (this.usuario.admin) {
      this.items.push({
        label: 'Cadastrar usuário',
        icon: 'pi pi-user-plus',
        routerLink: '/usuarios/cadastrar',
      });
    }
  }
}
