import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { debounceTime } from 'rxjs';
import { Aula } from '../../../models/aula';
import { InputTextModule } from 'primeng/inputtext';
import { AlunoService } from '../../../services/aluno.service';
import { AulaService } from '../../../services/aula.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-buscar-anotacoes-aulas',
  imports: [
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ReactiveFormsModule,
    CardModule,
  ],
  templateUrl: './buscar-anotacoes-aulas.component.html',
  styleUrl: './buscar-anotacoes-aulas.component.css',
})
export class BuscarAnotacoesAulasComponent implements OnInit {
  searchControl = new FormControl('');
  aulas: {
    id: number;
    dataAula: string;
    aluno_id: number;
    nomeAluno: string;
    anotacoes: string;
    fotoUrl: string;
  }[] = [];
  aulasFiltradas: {
    id: number;
    dataAula: string;
    aluno_id: number;
    nomeAluno: string;
    anotacoes: string;
    fotoUrl: string;
  }[] = [];

  constructor(private aulaService: AulaService) {}

  ngOnInit(): void {
    this.aulaService.listarAulas().subscribe(
      (
        aulas: {
          id: number;
          dataAula: string;
          aluno_id: number;
          nomeAluno: string;
          anotacoes: string;
          fotoUrl: string;
        }[]
      ) => {
        this.aulas = aulas;

        this.searchControl.valueChanges
          .pipe(debounceTime(300))
          .subscribe((termo: string | null) => {
            const t = this.removerAcentos(termo?.toLowerCase().trim() || '');
            if (!t) {
              this.aulasFiltradas = [];
              return;
            }
            this.aulasFiltradas = this.aulas.filter((a) => {
              // const textoAnotacao = this.removerAcentos(
              //   Object.values(a).join(' ').toLowerCase()
              // );
              const textoAnotacao = this.removerAcentos(a.anotacoes);
              return textoAnotacao.includes(t);
            });
          });
      }
    );
  }

  removerAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
