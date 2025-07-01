import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { Pais } from '../../../models/pais';
import { PaisService } from '../../../services/pais.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CidadePaisSpanComponent } from '../../../shared/cidade-pais-span/cidade-pais-span.component';
import { CidadePaisInputComponent } from '../../../shared/cidade-pais-input/cidade-pais-input.component';
import { CalendarModule } from 'primeng/calendar';
import { AlunoService } from '../../../services/aluno.service';
import { ToastService } from '../../../services/toast.service';
import { AlunoMapper } from '../../../mappers/aluno.mapper';
import { AlunoBasico } from '../../../models/dto/aluno-basico';

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
    CalendarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './informacoes-basicas.component.html',
  styleUrl: './informacoes-basicas.component.css',
})
export class InformacoesBasicasComponent implements OnInit {
  modoEdicao: boolean = false;
  @Input()
  alunoEditado!: AlunoBasico;
  @Output() editarInformacoesBasicas = new EventEmitter<AlunoBasico>();

  form!: FormGroup;

  paises: Pais[] = [];
  paisesFiltradosPaisMora: any[] = [];
  paisesFiltradosPaisNatal: any[] = [];

  mora: string | undefined = undefined;
  cidadeNatal: string | undefined = undefined;

  paisNatalObj: Pais | undefined = undefined;
  paisMoraObj: Pais | undefined = undefined;

  hoje: Date = new Date();

  constructor(
    private paisService: PaisService,
    private alunoService: AlunoService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.paisMoraObj = this.alunoEditado.paisMora;
    this.mora = this.alunoEditado.mora;
    this.cidadeNatal = this.alunoEditado.cidadeNatal;
    this.paisNatalObj = this.alunoEditado.paisNatal;

    this.form = this.fb.group({
      mora: [''],
      moraPaisObj: [''],
      moraPais: [''],
      idade: [this.alunoEditado.idade],
      dataAniversario: [
        new Date(this.alunoEditado.dataAniversario) || new Date(),
      ],
      familia: [this.alunoEditado.familia],
      paisNatalObj: [''],
      cidadeNatal: [''],
      paisNatal: [''],
      profissao: [this.alunoEditado.profissao],
      hobbies: [this.alunoEditado.hobbies],
      linkPerfil: [this.alunoEditado.linkPerfil],
      pontos: [this.alunoEditado.pontos],
    });

    this.paisService.getPaises().subscribe({
      next: (res) => {
        this.paises = res;
      },
    });
  }

  executarAcaoEdicao() {
    if (this.modoEdicao) {
      this.form.value.mora = this.mora;
      this.form.value.cidadeNatal = this.cidadeNatal;

      const alunoConvertido: AlunoBasico = AlunoMapper.fromForm(
        this.form,
        this.paisMoraObj!,
        this.paisNatalObj!,
        this.alunoEditado.id
      );

      this.alunoService
        .atualizarAluno(this.alunoEditado.id, alunoConvertido)
        .subscribe({
          next: (res) => {
            this.toastService.success(res.mensagem);
            this.editarInformacoesBasicas.emit(alunoConvertido);
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
