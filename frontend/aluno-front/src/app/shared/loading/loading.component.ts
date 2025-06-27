import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, DialogModule, ProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
  visible = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe((ativo) => {
      this.visible = ativo;
    });
  }
}
