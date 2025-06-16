import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-global-toast',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: './global-toast.component.html',
  styleUrl: './global-toast.component.css',
})
export class GlobalToastComponent {}
