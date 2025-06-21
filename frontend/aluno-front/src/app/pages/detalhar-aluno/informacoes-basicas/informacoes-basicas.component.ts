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
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { AlunoBasico } from './dto/aluno-informacoes-basicas';
import { Pais } from '../../../models/pais';
import { PaisService } from '../../../services/pais.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CidadePaisSpanComponent } from '../../../shared/cidade-pais-span/cidade-pais-span.component';
import { CidadePaisInputComponent } from '../../../shared/cidade-pais-input/cidade-pais-input.component';

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
    AutoCompleteModule,
    CidadePaisSpanComponent,
    CidadePaisInputComponent,
  ],
  templateUrl: './informacoes-basicas.component.html',
  styleUrl: './informacoes-basicas.component.css',
})
export class InformacoesBasicasComponent implements OnInit {
  modoEdicao: boolean = false;
  @Input()
  alunoEditado!: AlunoBasico;
  @Output() editarInformacoesBasicas = new EventEmitter<AlunoBasico>();

  paises: Pais[] = [];
  paisesFiltradosPaisMora: any[] = [];
  paisesFiltradosPaisNatal: any[] = [];

  paisNatalObj: Pais | undefined = undefined;
  paisMoraObj: Pais | undefined = undefined;

  constructor(private paisService: PaisService) {}

  ngOnInit(): void {
    this.paisNatalObj = this.alunoEditado.paisNatal;
    this.paisMoraObj = this.alunoEditado.paisMora;

    this.paisService.getPaises().subscribe({
      next: (res) => {
        this.paises = res;
      },
    });
  }

  executarAcaoEdicao() {
    if (this.modoEdicao) {
      this.alunoEditado.paisNatal = this.paisNatalObj;
      this.alunoEditado.paisMora = this.paisMoraObj;

      this.editarInformacoesBasicas.emit(this.alunoEditado!);
    }

    this.modoEdicao = !this.modoEdicao;
  }

  cancelarEdicao() {
    this.modoEdicao = false;
  }

  filtrarPaisMora(query: string) {
    query = query.toLowerCase();
    this.paisesFiltradosPaisMora = this.paises.filter((pais) =>
      pais.nome.toLowerCase().includes(query)
    );
  }

  filtrarPaisNatal(query: string) {
    query = query.toLowerCase();
    this.paisesFiltradosPaisNatal = this.paises.filter((pais) =>
      pais.nome.toLowerCase().includes(query)
    );
  }
}
