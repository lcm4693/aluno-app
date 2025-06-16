import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Aula } from '../../../models/aula';
import { dataNoFuturoValidator } from '../../../validators';

@Component({
  selector: 'app-nova-aula',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    InputTextareaModule,
    InputTextModule,
  ],
  templateUrl: './nova-aula.component.html',
  styleUrl: './nova-aula.component.css',
})
export class NovaAulaComponent {
  form: FormGroup;
  hoje: Date = new Date();
  @Output() salvarAula = new EventEmitter<Aula>();
  @Output() cancelar = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      dataAula: [new Date(), [Validators.required, dataNoFuturoValidator()]],
      anotacoes: ['', Validators.required],
      comentarios: [''],
      proximaAula: [''],
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Object.keys(this.form.controls).forEach((campo) => {
        const control = this.form.get(campo);
        if (control && control.invalid) {
          console.warn(`Campo "${campo}" inválido. Erros:`, control.errors);
        }
      });
      return;
    } else {
      const aula = new Aula(
        this.form.get('dataAula')?.value,
        this.form.get('anotacoes')?.value,
        this.form.get('comentarios')?.value,
        this.form.get('proximaAula')?.value
      );
      this.salvarAula.emit(aula);
    }
  }

  onCancel(): void {
    this.cancelar.emit();
  }
}
