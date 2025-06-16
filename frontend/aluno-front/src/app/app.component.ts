import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GlobalToastComponent } from './shared/ui/global-toast/global-toast/global-toast.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, GlobalToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
