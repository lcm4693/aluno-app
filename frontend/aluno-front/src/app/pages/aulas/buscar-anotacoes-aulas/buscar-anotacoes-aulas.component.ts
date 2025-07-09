import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { debounceTime } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { AulaService } from '../../../services/aula.service';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { PanelModule } from 'primeng/panel';

interface InterfaceAulaAnotacoes {
  id: number;
  dataAula: Date;
  aluno_id: number;
  nomeAluno: string;
  anotacoes: string;
  fotoUrl: string;
}

@Component({
  selector: 'app-buscar-anotacoes-aulas',
  imports: [
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ReactiveFormsModule,
    CardModule,
    DialogModule,
    DatePickerModule,
    PanelModule,
    FormsModule,
  ],
  templateUrl: './buscar-anotacoes-aulas.component.html',
  styleUrl: './buscar-anotacoes-aulas.component.css',
})
export class BuscarAnotacoesAulasComponent implements OnInit, AfterViewInit {
  @ViewChild('topo') topoRef!: ElementRef;

  searchControl = new FormControl('');
  hoje: Date = new Date();
  aula: InterfaceAulaAnotacoes | undefined = undefined;
  modalNovaDetalharAulaVisivel = false;
  aulas: InterfaceAulaAnotacoes[] = [];
  aulasFiltradas: InterfaceAulaAnotacoes[] = [];

  constructor(private aulaService: AulaService) {}

  ngOnInit(): void {
    this.aulaService
      .listarAulas()
      .subscribe((aulas: InterfaceAulaAnotacoes[]) => {
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
              const textoAnotacao = this.removerAcentos(a.anotacoes);
              return textoAnotacao.includes(t);
            });
          });
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.topoRef?.nativeElement?.focus();
    }, 0);
  }

  removerAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  selecionarAula(aula: InterfaceAulaAnotacoes) {
    aula.dataAula = new Date(aula.dataAula);
    this.aula = aula;
    this.modalNovaDetalharAulaVisivel = true;
  }
}
