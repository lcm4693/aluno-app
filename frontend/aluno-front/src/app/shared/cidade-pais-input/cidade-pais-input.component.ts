import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-cidade-pais-input',
  standalone: true,
  imports: [CommonModule, AutoCompleteModule, InputTextModule, FormsModule],
  templateUrl: './cidade-pais-input.component.html',
  styleUrl: './cidade-pais-input.component.css',
})
export class CidadePaisInputComponent {
  @Input() cidade: string = '';
  @Output() cidadeChange = new EventEmitter<string>();

  @Input() pais: any;
  @Output() paisChange = new EventEmitter<any>();

  @Input() paisesFiltrados: any[] = [];
  @Output() buscarPaises = new EventEmitter<string>();
}
