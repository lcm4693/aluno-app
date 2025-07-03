import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AlunoFavorito } from '../../../models/alunoFavorito';
import { DashboardService } from '../../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css',
})
export class FavoritosComponent implements OnInit {
  favoritos: AlunoFavorito[] | undefined;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.getAlunosFavoritos().subscribe({
      next: (res) => {
        this.favoritos = res;
      },
    });
  }

  redirecionarAluno(idAluno: number) {
    this.router.navigate([`/alunos`, idAluno], {
      queryParams: { origem: '/' },
    });
  }
}
