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
  ],
  providers: [ConfirmationService], // <-- Aqui você fornece o serviço!
  templateUrl: './listar-alunos.component.html',
  styleUrl: './listar-alunos.component.css',
})
export class ListarAlunosComponent {
  alunos: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private alunoService: AlunoService // Se você tiver um serviço específico para alunos, pode injetá-lo aqui
  ) {}

  ngOnInit(): void {
    this.alunoService.getAlunos().subscribe({
      next: (res) => {
        this.alunos = res;
        // Para cada aluno, buscar a imagem correspondente
        this.alunos.forEach((aluno: Aluno) => {
          const nomeFoto = aluno.fotoUrl; // ou o campo correspondente
          // this.buscarFotoAluno(nomeFoto, aluno);
        });
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao carregar alunos.');
      },
      complete: () => {},
    });
  }

  // buscarFotoAluno(nomeFoto: string, aluno: any): void {
  //   this.alunoService.buscarFotoAlunoPorNome(nomeFoto).subscribe({
  //     next: (res) => {
  //       const objectURL = URL.createObjectURL(res);
  //       aluno.imagemFoto = objectURL; // Atribui a URL do objeto à propriedade imagemFoto do aluno
  //     },
  //     error: (err) => {
  //       console.error('Erro ao buscar foto do aluno:', err);
  //     },
  //     complete: () => {},
  //   });
  // }

  voltarInicio(): void {
    this.router.navigateByUrl('');
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
          },
          error: (err) => {
            console.error('Erro ao excluir:', err);
            alert(err.error?.erro || 'Erro ao excluir aluno.');
          },
          complete: () => {},
        });
      },
    });
  }
}
