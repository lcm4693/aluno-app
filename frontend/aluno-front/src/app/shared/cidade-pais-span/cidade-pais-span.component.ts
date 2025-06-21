import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-cidade-pais-span',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './cidade-pais-span.component.html',
  styleUrl: './cidade-pais-span.component.css',
})
export class CidadePaisSpanComponent {
  @Input() cidade?: string;
  @Input() pais?: string;
}
