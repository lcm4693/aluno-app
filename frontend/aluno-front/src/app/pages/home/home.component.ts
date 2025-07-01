import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserStoreService } from '../../auth/services/user-store.service';
import { Usuario } from '../../models/usuario';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, CardModule, TableModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  usuario!: Usuario;

  ultimasAulas = [
    {
      id: 101,
      nomeAluno: 'Anna Kowalska',
      data: new Date('2025-06-28'),
    },
    {
      id: 102,
      nomeAluno: 'Hiroshi Tanaka',
      data: new Date('2025-06-27'),
    },
    {
      id: 103,
      nomeAluno: 'Sofia García',
      data: new Date('2025-06-26'),
    },
  ];

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
