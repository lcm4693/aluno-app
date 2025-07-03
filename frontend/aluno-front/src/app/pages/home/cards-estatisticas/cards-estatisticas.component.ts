import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Estatisticas } from '../../../models/estatisticas';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-cards-estatisticas',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './cards-estatisticas.component.html',
  styleUrl: './cards-estatisticas.component.css',
})
export class CardsEstatisticasComponent implements OnInit {
  cardsEstatisticas: Estatisticas | undefined;

  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {
    this.dashboardService.getCardsEstatisticas().subscribe({
      next: (res) => {
        this.cardsEstatisticas = res;
      },
    });
  }
}
