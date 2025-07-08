import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GlobalToastComponent } from './shared/ui/global-toast/global-toast/global-toast.component';
import { UserStoreService } from './auth/services/user-store.service';
import { LoadingService } from './services/loading.service';
import { Observable } from 'rxjs';
import { LoadingComponent } from './shared/loading/loading.component';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './shared/menu/menu.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    GlobalToastComponent,
    LoadingComponent,
    CommonModule,
    MenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  carregando$!: Observable<boolean>;

  constructor(
    private userStorage: UserStoreService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.carregando$ = this.loadingService.loading$;
    const token = localStorage.getItem('token-aluno-app');
    const refreshToken = localStorage.getItem('refresh-aluno-app');

    if (token) {
      this.userStorage.setUsuarioFromToken(token, refreshToken!);
    }
  }

  ngOnInit() {}

  urlPermiteMenu(): boolean {
    const urlSemMenu = ['/login'];
    return !urlSemMenu.includes(this.router.url);
  }
}
