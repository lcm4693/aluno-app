import { Component, OnInit } from '@angular/core';
import { Notificacao } from '../../../models/notificacoes/notificacao';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule, DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { LoggerService } from '../../../services/logger.service';
import { Accordion, AccordionModule, AccordionTab } from 'primeng/accordion';
import { AulaSemAnotacao } from '../../../models/notificacoes/aulasSemAnotacao';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule, CardModule, AccordionModule],
  providers: [DatePipe, AccordionTab, Accordion],
  templateUrl: './notificacoes.component.html',
  styleUrl: './notificacoes.component.css',
})
export class NotificacoesComponent implements OnInit {
  notificacoes: Notificacao | undefined;

  constructor(
    private dashboardService: DashboardService,
    private loggerService: LoggerService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.dashboardService.geNotificacoes().subscribe({
      next: (res) => {
        this.loggerService.info(JSON.stringify(res));
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
      },
    });
  }

  marcarComoLida(aula: AulaSemAnotacao) {
    console.log(JSON.stringify(aula));
  }
}
