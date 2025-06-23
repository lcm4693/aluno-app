import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { Aula } from '../../../../../models/aula';
import { AulaService } from '../../../../../services/aula.service';
import { ToastService } from '../../../../../services/toast.service';
import { Router } from '@angular/router';
import { AulaFormComponent } from '../aula-form/aula-form.component';
import { CommonModule } from '@angular/common';
import { Aluno } from '../../../../../models/aluno';
import { FormGroup } from '@angular/forms';
import { AulaFormService } from '../../services/aula-form.service';

@Component({
  selector: 'app-criar-aula',
  standalone: true,
  imports: [AulaFormComponent, CommonModule],
  templateUrl: './criar-aula.component.html',
  styleUrl: './criar-aula.component.css',
})
export class CriarAulaComponent {
  @Input() aluno!: Aluno;
  aula!: Aula;
  @Output() salvarAula = new EventEmitter<Aula>();
  @Output() cancelar = new EventEmitter<void>();
  form: FormGroup;

  constructor(private formService: AulaFormService) {
    this.form = this.formService.createForm();
  }

  salvar(aula: Aula): void {
    this.salvarAula.emit(aula);
    this.form.reset(); // <-- limpa o formulário depois do envio
  }

  voltar(): void {
    this.cancelar.emit();
  }
}
