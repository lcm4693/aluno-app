import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { UltimasAulas } from '../../../models/ultimas_aulas';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-ultimas-aulas',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './ultimas-aulas.component.html',
  styleUrl: './ultimas-aulas.component.css',
})
export class UltimasAulasComponent implements OnInit {
  ultimasAulas: UltimasAulas[] | undefined;

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getUltimasAulas().subscribe({
      next: (res) => {
        this.ultimasAulas = res;
      },
    });
  }

  redirecionarAluno(idAluno: number, idAula: number | undefined) {
    this.router.navigate([`/alunos`, idAluno], {
      queryParams: { origem: '/', aula: idAula },
    });
  }
}
