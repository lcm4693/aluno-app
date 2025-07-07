import { Component, OnInit } from '@angular/core';
import { Notificacao } from '../../../models/notificacoes/notificacao';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule, DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { LoggerService } from '../../../services/logger.service';
import { AulaSemAnotacao } from '../../../models/notificacoes/aulasSemAnotacao';
import { AccordionModule } from 'primeng/accordion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule, CardModule, AccordionModule],
  providers: [DatePipe],
  templateUrl: './notificacoes.component.html',
  styleUrl: './notificacoes.component.css',
})
export class NotificacoesComponent implements OnInit {
  notificacoes: Notificacao | undefined;

  constructor(
    private dashboardService: DashboardService,
    private loggerService: LoggerService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.geNotificacoes().subscribe({
      next: (res) => {
        this.notificacoes = res;
        this.notificacoes.aulasSemAnotacao.forEach((aula) => {
          const dataAula = this.datePipe.transform(
            aula.dataAula,
            'dd/MM/yyyy',
            undefined,
            'pt-BR'
          );
          aula.mensagem = `Aula de ${aula.nomeAluno} (${dataAula})`;
        });

        this.notificacoes.aniversariosAlunos.forEach((aluno) => {
          const dataAniversario = this.datePipe.transform(
            aluno.dataAniversario,
            'dd/MM/yyyy',
            undefined,
            'pt-BR'
          );
          aluno.mensagem = `${aluno.nomeAluno} (${dataAniversario})`;
        });
      },
    });
  }

  marcarComoLida(obj: any) {
    console.log(JSON.stringify(obj));
  }

  redirecionarAlunoAula(idAluno: number, idAula: number | undefined) {
    this.router.navigate([`/alunos`, idAluno], {
      queryParams: { origem: '/', aula: idAula },
    });
  }
}
