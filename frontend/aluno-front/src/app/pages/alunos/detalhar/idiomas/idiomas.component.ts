import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { Idioma } from '../../../../models/idioma';
import { IdiomaService } from '../../../../services/idioma.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-idiomas',
  standalone: true,
  imports: [
    CommonModule,
    FieldsetModule,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './idiomas.component.html',
  styleUrl: './idiomas.component.css',
})
export class IdiomasComponent implements OnInit {
  // @Input() idAluno!: number | null;
  // @Input() idiomasAluno!: Idioma[] | null;
  _idAluno!: number | null;
  _idiomasAluno!: Idioma[] | null;

  @Output() editarIdiomas = new EventEmitter<Idioma[]>();

  modoEdicao: boolean = false;

  idiomasDisponiveis: Idioma[] = [];
  idiomasSelecionados: number[] = [];

  constructor(
    private idiomaService: IdiomaService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.iniciaIdiomasSelecionados();
    this.idiomaService.getIdiomas().subscribe({
      next: (res) => {
        this.idiomasDisponiveis = res;
      },
      complete: () => {},
    });
  }

  iniciaIdiomasSelecionados() {
    this.idiomasSelecionados = this.idiomasAluno?.map((i) => i.id) || [];
  }

  @Input() set idAluno(value: number) {
    this._idAluno = value;
  }

  get idAluno(): number | null {
    return this._idAluno;
  }

  @Input() set idiomasAluno(value: Idioma[]) {
    this._idiomasAluno = value;
    if (value) {
      this.iniciaIdiomasSelecionados();
    }
  }

  get idiomasAluno(): Idioma[] | null {
    return this._idiomasAluno;
  }

  executarAcaoEdicao() {
    if (this.modoEdicao) {
      this.idiomasAluno = this.idiomasDisponiveis.filter((idioma) =>
        this.idiomasSelecionados.includes(idioma.id)
      );

      this.idiomaService
        .atualizarIdiomasAluno(this.idAluno!, this.idiomasAluno)
        .subscribe({
          next: (res) => {
            this.toastService.success(res.mensagem);
            this.editarIdiomas.emit(this.idiomasAluno!);
          },
          complete: () => {
            this.modoEdicao = !this.modoEdicao;
          },
        });
    } else {
      this.modoEdicao = !this.modoEdicao;
    }
  }

  cancelarEdicao() {
    this.modoEdicao = false;
  }
}
