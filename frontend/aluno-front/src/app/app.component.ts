import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GlobalToastComponent } from './shared/ui/global-toast/global-toast/global-toast.component';
import { UserStoreService } from './auth/services/user-store.service';
import { LoadingService } from './services/loading.service';
import { Observable } from 'rxjs';
import { LoadingComponent } from './shared/loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, GlobalToastComponent, LoadingComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  carregando$!: Observable<boolean>;

  constructor(
    private userStorage: UserStoreService,
    private loadingService: LoadingService
  ) {
    this.carregando$ = this.loadingService.loading$;
    const token = localStorage.getItem('token-aluno-app');
    const refreshToken = localStorage.getItem('refresh-aluno-app');

    if (token) {
      this.userStorage.setUsuarioFromToken(token, refreshToken!);
    }
  }

  ngOnInit() {}
}
