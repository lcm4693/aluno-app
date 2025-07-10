import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { UserStoreService } from '../../auth/services/user-store.service';
import { Usuario } from '../../models/usuario';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../services/logger.service';
import { AlunoService } from '../../services/aluno.service';
import { AlunoNotificationService } from '../../services/aluno-notification.service';
import { TextUtils } from '../utils/text-utils';

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
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  constructor(
    private userStorage: UserStoreService,
    private router: Router,
    private loggerService: LoggerService,
    private alunoService: AlunoService,
    private alunoNotificationService: AlunoNotificationService
  ) {}

  @ViewChild('autocompleteRef', { read: ElementRef })
  autocompleteRef!: ElementRef;

  items: any[] | undefined = undefined;

  usuario: Usuario | undefined;

  alunoSelecionado: any = null;

  alunosFiltrados: { id: number; nome: string; fotoUrl: string }[] = [];
  alunos: { id: number; nome: string; fotoUrl: string }[] = [];

  ngOnInit(): void {
    this.usuario = this.userStorage.getUsuario()!;

    if (this.usuario) {
      this.carregarAlunosParaMenu();
    }

    this.alunoNotificationService.listaAlunosAlterada$.subscribe(() => {
      this.loggerService.info('Recarregando listagem de alunos para o menu');
      this.carregarAlunosParaMenu();
    });

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
        icon: 'pi pi-file-edit',
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

    if (this.usuario?.admin) {
      this.items.push({
        label: 'Cadastrar usuário',
        icon: 'pi pi-user-plus',
        routerLink: '/usuarios/cadastrar',
      });
    }
  }

  carregarAlunosParaMenu() {
    this.alunoService.getAlunosParaMenu().subscribe({
      next: (res) => {
        this.alunos = res;
        this.alunosFiltrados = res;
      },
    });
  }

  filtrarAlunos(event: { query: string }) {
    const query = TextUtils.removerAcentos(
      event.query.toLowerCase().trim() || ''
    );
    this.loggerService.info('Query:', query);
    this.alunosFiltrados = this.alunos.filter((aluno) => {
      const nomeAluno = TextUtils.removerAcentos(aluno.nome.toLowerCase());
      return nomeAluno.includes(query);
    });
  }

  irParaDetalharAluno(obj: any) {
    const aluno = obj.value;
    this.router.navigate([`/alunos`, aluno.id]).then(() => {
      this.loggerService.info(JSON.stringify(aluno));
      this.alunoSelecionado = null;
      this.alunosFiltrados = [];

      // Tirar o foco do input após pequeno delay
      setTimeout(() => {
        const input = this.autocompleteRef.nativeElement.querySelector(
          'input'
        ) as HTMLInputElement;

        input?.blur();
      });
    });
  }
}
