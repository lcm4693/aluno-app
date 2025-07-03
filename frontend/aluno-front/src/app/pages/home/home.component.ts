import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserStoreService } from '../../auth/services/user-store.service';
import { Usuario } from '../../models/usuario';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { UltimasAulasComponent } from './ultimas-aulas/ultimas-aulas.component';
import { CardsEstatisticasComponent } from './cards-estatisticas/cards-estatisticas.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    FavoritosComponent,
    UltimasAulasComponent,
    CardsEstatisticasComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  usuario!: Usuario;

  constructor(
    private router: Router,
    private userStoreService: UserStoreService
  ) {}

  ngOnInit(): void {
    this.usuario = this.userStoreService.getUsuario()!;
  }

  navegar(path: string) {
    this.router.navigateByUrl(path);
  }
}
