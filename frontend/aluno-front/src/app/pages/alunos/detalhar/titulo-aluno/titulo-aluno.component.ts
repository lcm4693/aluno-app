import { Component, Input } from '@angular/core';
import { AlunoBasico } from '../../../../models/dto/aluno-basico';
import { Aluno } from '../../../../models/aluno';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlunoService } from '../../../../services/aluno.service';
import { ToastService } from '../../../../services/toast.service';
import { Constants } from '../../../../shared/constants';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { AlunoNotificationService } from '../../../../services/aluno-notification.service';

@Component({
  selector: 'app-titulo-aluno',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './titulo-aluno.component.html',
  styleUrl: './titulo-aluno.component.css',
})
export class TituloAlunoComponent {
  _alunoEditado!: Aluno;

  form!: FormGroup;

  niveis = Constants.niveis;

  modoEdicao: boolean = false;

  constructor(
    private alunoService: AlunoService,
    private toastService: ToastService,
    private alunoNotificationService: AlunoNotificationService,
    private fb: FormBuilder
  ) {}

  criarForm() {
    this.form = this.fb.group({
      nome: [this.alunoEditado.nome, Validators.required],
      nivel: [this.alunoEditado.nivel, Validators.required],
    });
  }

  cancelarEdicao() {
    this.modoEdicao = false;
    this.form.markAsUntouched();
  }

  executarAcaoEdicao() {
    if (this.modoEdicao) {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      const aluno = {
        nome: this.form.value.nome,
        nivel: this.form.value.nivel,
      };

      this.alunoService
        .atualizarNomeNivelAluno(this.alunoEditado.id, aluno)
        .subscribe({
          next: (res) => {
            this.toastService.success(res.mensagem);
            this.alunoEditado.nome = aluno.nome;
            this.alunoEditado.nivel = aluno.nivel;
            this.alunoNotificationService.notificarAlteracaoListaAluno();
            this.modoEdicao = !this.modoEdicao;
          },
        });
    } else {
      this.modoEdicao = !this.modoEdicao;
    }
  }

  @Input() set alunoEditado(value: Aluno) {
    this._alunoEditado = value;
    if (value) {
      this.criarForm();
    }
  }

  get alunoEditado(): Aluno {
    return this._alunoEditado;
  }
}
