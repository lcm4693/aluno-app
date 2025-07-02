import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserStoreService } from '../../auth/services/user-store.service';
import { Usuario } from '../../models/usuario';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { Estatisticas } from '../../models/estatisticas';
import { DashboardService } from '../../services/dashboard.service';
import { AlunoFavorito } from '../../models/alunoFavorito';
import { UltimasAulas } from '../../models/ultimas_aulas';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TableModule,
    AvatarModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  usuario!: Usuario;

  cardsEstatisticas: Estatisticas | undefined;

  favoritos: AlunoFavorito[] | undefined;

  ultimasAulas: UltimasAulas[] | undefined;

  constructor(
    private router: Router,
    private userStoreService: UserStoreService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.usuario = this.userStoreService.getUsuario()!;
    this.dashboardService.getCardsEstatisticas().subscribe({
      next: (res) => {
        this.cardsEstatisticas = res;
      },
    });

    this.dashboardService.getAlunosFavoritos().subscribe({
      next: (res) => {
        this.favoritos = res;
      },
    });

    this.dashboardService.getUltimasAulas().subscribe({
      next: (res) => {
        this.ultimasAulas = res;
      },
    });
  }

  navegar(path: string) {
    this.router.navigateByUrl(path);
  }
}
