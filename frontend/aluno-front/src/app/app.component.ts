import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GlobalToastComponent } from './shared/ui/global-toast/global-toast/global-toast.component';
import { UserStoreService } from './auth/services/user-store.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, GlobalToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private userStorage: UserStoreService) {
    const token = localStorage.getItem('token');
    if (token) {
      this.userStorage.setUsuarioFromToken(token);
    }
  }

  ngOnInit() {}
}
