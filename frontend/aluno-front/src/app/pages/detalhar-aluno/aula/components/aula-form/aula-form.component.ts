import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Aula } from '../../../../../models/aula';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AulaFormService } from '../../services/aula-form.service';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-aula-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    InputTextareaModule,
    ButtonModule,
    PanelModule,
  ],
  templateUrl: './aula-form.component.html',
  styleUrl: './aula-form.component.css',
})
export class AulaFormComponent implements OnInit {
  @Input() aula?: Aula | null;
  @Input() modo: 'criar' | 'editar' | 'visualizar' | null = null;

  @Output() formSubmit = new EventEmitter<Aula>();
  @Output() cancelar = new EventEmitter<void>();
  // @Output()
  form!: FormGroup;
  hoje: Date = new Date();

  constructor(private formService: AulaFormService) {}

  ngOnInit(): void {
    this.form = this.formService.createForm(this.aula!);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      Object.keys(this.form.controls).forEach((campo) => {
        const control = this.form.get(campo);
        if (control && control.invalid) {
          console.warn(`Campo "${campo}" inválido. Erros:`, control.errors);
        }
      });

      return;
    }

    const aula = this.formService.getAulaFromForm(this.form);
    this.formSubmit.emit(aula);
  }

  fechar(): void {
    this.cancelar.emit();
  }
}
