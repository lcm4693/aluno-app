import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { Idioma } from '../../../models/idioma';
import { HttpClient } from '@angular/common/http';
import { IdiomaService } from '../../../services/idioma.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

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
  modoEdicao: boolean = false;
  idiomasDisponiveis: Idioma[] = [];
  @Input() idiomasAluno!: Idioma[] | null;
  idiomasSelecionados: number[] = [];
  @Output() editarIdiomas = new EventEmitter<Idioma[]>();

  constructor(private idiomaService: IdiomaService) {}

  ngOnInit(): void {
    this.idiomasSelecionados = this.idiomasAluno?.map((i) => i.id) || [];

    this.idiomaService.getIdiomas().subscribe({
      next: (res) => {
        this.idiomasDisponiveis = res;
      },
      complete: () => {},
    });
  }

  executarAcaoEdicao() {
    if (this.modoEdicao) {
      this.idiomasAluno = this.idiomasDisponiveis.filter((idioma) =>
        this.idiomasSelecionados.includes(idioma.id)
      );
      this.editarIdiomas.emit(this.idiomasAluno!);
    }

    this.modoEdicao = !this.modoEdicao;
  }

  cancelarEdicao() {
    this.modoEdicao = false;
  }
}
