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

  ultimasAulas = [
    {
      id: 101,
      nomeAluno: 'Anna Kowalska',
      data: new Date('2025-06-28'),
      totalAulas: 10,
      enderecoFoto:
        'https://aluno-app-fotos.s3.us-east-1.amazonaws.com/fotos-dev/438aac3b-4e94-4b04-b386-e2e89289a92b.jpg',
    },
    {
      id: 102,
      nomeAluno: 'Hiroshi Tanaka',
      data: new Date('2025-06-27'),
      totalAulas: 5,
      enderecoFoto:
        'https://aluno-app-fotos.s3.us-east-1.amazonaws.com/fotos-dev/foto_1750264887.png',
    },
    {
      id: 103,
      nomeAluno: 'Sofia García',
      data: new Date('2025-06-26'),
      totalAulas: 3,
      enderecoFoto:
        'https://aluno-app-fotos.s3.us-east-1.amazonaws.com/fotos-dev/foto_1750008120.png',
    },
  ];

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
  }

  navegar(path: string) {
    this.router.navigateByUrl(path);
  }
}
