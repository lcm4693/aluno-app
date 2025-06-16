import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { Aula } from '../../../models/aula';

@Component({
  selector: 'app-detalhar-aula',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PanelModule,
    CalendarModule,
    FormsModule,
  ],
  templateUrl: './detalhar-aula.component.html',
  styleUrl: './detalhar-aula.component.css',
})
export class DetalharAulaComponent implements AfterViewInit {
  @ViewChild('topo') topoRef!: ElementRef;

  @Input() aula!: Aula | null;
  @Output() fechar = new EventEmitter<void>();

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log('foco');
      this.topoRef?.nativeElement?.focus();
    }, 0);
  }
}
