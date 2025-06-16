import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { Aluno } from '../../../models/aluno';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { Idioma } from '../../../models/idioma';
import { HttpClient } from '@angular/common/http';
import { IdiomaService } from '../../../services/idioma.service';
import { AlunoBasico } from './dto/aluno-informacoes-basicas';

@Component({
  selector: 'app-informacoes-basicas',
  standalone: true,
  imports: [
    CommonModule,
    FieldsetModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    TooltipModule,
    CheckboxModule,
  ],
  templateUrl: './informacoes-basicas.component.html',
  styleUrl: './informacoes-basicas.component.css',
})
export class InformacoesBasicasComponent {
  modoEdicao: boolean = false;
  @Input()
  alunoEditado!: AlunoBasico | null;
  @Output() editarInformacoesBasicas = new EventEmitter<AlunoBasico>();

  constructor() {}

  executarAcaoEdicao() {
    if (this.modoEdicao) {
      console.log('Aluno Editado comp:', this.alunoEditado);
      this.editarInformacoesBasicas.emit(this.alunoEditado!);
    }

    this.modoEdicao = !this.modoEdicao;
  }

  cancelarEdicao() {
    this.modoEdicao = false;
  }
}
