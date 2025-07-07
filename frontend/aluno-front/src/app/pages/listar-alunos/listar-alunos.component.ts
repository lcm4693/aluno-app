import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { AlunoService } from '../../services/aluno.service';
import { Aluno } from '../../models/aluno';
import { ToastService } from '../../services/toast.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { LoggerService } from '../../services/logger.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  standalone: true,
  selector: 'app-listar-alunos',
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    AvatarModule,
    TooltipModule,
    ConfirmDialogModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  providers: [ConfirmationService], // <-- Aqui você fornece o serviço!
  templateUrl: './listar-alunos.component.html',
  styleUrl: './listar-alunos.component.css',
})
export class ListarAlunosComponent {
  alunos: any[] = [];

  searchControl = new FormControl('');
  alunosFiltrados: Aluno[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private alunoService: AlunoService, // Se você tiver um serviço específico para alunos, pode injetá-lo aqui
    private toastService: ToastService,
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    this.alunoService.getAlunos().subscribe({
      next: (res) => {
        this.alunos = res;
        this.alunosFiltrados = [...this.alunos]; // lista original
        this.searchControl.valueChanges
          .pipe(debounceTime(300))
          .subscribe((termo: string | null) => {
            const t = this.removerAcentos(termo?.toLowerCase().trim() || '');
            this.alunosFiltrados = this.alunos.filter((a) => {
              const alunoTexto = this.removerAcentos(
                Object.values(a).join(' ').toLowerCase()
              );
              return alunoTexto.includes(t);
            });
          });
      },
      complete: () => {},
    });
  }

  voltarInicio(): void {
    this.router.navigateByUrl('');
  }

  removerAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  confirmarExclusao(alunoParaExcluir: any) {
    this.confirmationService.confirm({
      message: `Deseja excluir o aluno ${alunoParaExcluir.nome}?`,
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      defaultFocus: 'reject', // força foco no botão "Cancelar"
      acceptButtonStyleClass: 'p-button-outlined p-button-danger order-1 ml-2',
      rejectButtonStyleClass: 'order-2',
      accept: () => {
        this.alunoService.excluirAluno(alunoParaExcluir.id).subscribe({
          next: (res: any) => {
            // sucesso → remove da lista
            this.alunos = this.alunos.filter(
              (a) => a.id !== alunoParaExcluir.id
            );
            this.toastService.success(res.mensagem);
          },
          error: (err) => {
            this.loggerService.error('Erro ao excluir:', err);
            this.toastService.error(err.erro);
          },
          complete: () => {},
        });
      },
    });
  }
}
