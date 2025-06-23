import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AulaFormComponent } from '../aula-form/aula-form.component';
import { Aula } from '../../../../../models/aula';
import { AulaFormService } from '../../services/aula-form.service';

@Component({
  selector: 'app-editar-aula',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AulaFormComponent],
  templateUrl: './editar-aula.component.html',
})
export class EditarAulaComponent implements OnInit {
  @Input() aula!: Aula;
  @Output() salvarAula = new EventEmitter<Aula>();
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private formService: AulaFormService) {}

  ngOnInit(): void {
    this.form = this.formService.createForm(this.aula);
  }

  salvar(aula: Aula): void {
    this.salvarAula.emit(aula);
  }
}
