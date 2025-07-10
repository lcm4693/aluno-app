import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { NovaAulaComponent } from './nova-aula/nova-aula.component';
import { Aula } from '../../../models/aula';
import { Aluno } from '../../../models/aluno';
import { TooltipModule } from 'primeng/tooltip';
import { AlunoService } from '../../../services/aluno.service';
import { AulaService } from '../../../services/aula.service';
import { SafeUrl } from '@angular/platform-browser';
import { IdiomasComponent } from './idiomas/idiomas.component';
import { Idioma } from '../../../models/idioma';
import { DetalharAulaComponent } from './detalhar-aula/detalhar-aula.component';
import { ToastService } from '../../../services/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { AlunoBasico } from '../../../models/dto/aluno-basico';
import { DatePickerModule } from 'primeng/datepicker';
import { InformacoesBasicasComponent } from './informacoes-basicas/informacoes-basicas.component';
import { PrimeiraAulaComponent } from './primeira-aula/primeira-aula.component';
import { UploadFotoComponent } from './upload-foto/upload-foto.component';
import { LoggerService } from '../../../services/logger.service';

@Component({
  standalone: true,
  selector: 'app-detalhar-aluno',
  imports: [
    CardModule,
    ButtonModule,
    FieldsetModule,
    CommonModule,
    DialogModule,
    NovaAulaComponent,
    DetalharAulaComponent,
    TooltipModule,
    InformacoesBasicasComponent,
    IdiomasComponent,
    InputTextModule,
    PrimeiraAulaComponent,
    UploadFotoComponent,
    DatePickerModule,
  ],
  templateUrl: './detalhar-aluno.component.html',
  styleUrl: './detalhar-aluno.component.css',
})
export class DetalharAlunoComponent implements OnInit {
  aluno?: Aluno;

  //Usarei esse campo para passar somente as inf do fieldset informações pessoais
  alunoBasico!: AlunoBasico;

  aulaSelecionada: Aula | null = null;

  modalAtualizarFotoVisivel = false;
  modalNovaAulaVisivel = false;
  modalNovaDetalharAulaVisivel = false;

  fotoAlunoUrl: SafeUrl | null = null;

  origem!: string | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alunoService: AlunoService,
    private aulaService: AulaService,
    private toastService: ToastService,
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const alunoId = params.get('id');
      const aulaId = this.route.snapshot.queryParamMap.get('aula');
      this.origem = this.route.snapshot.queryParamMap.get('origem');

      this.loggerService.info('Origem:' + this.origem);
      if (alunoId) {
        this.alunoService.getAluno(+alunoId).subscribe({
          next: (res) => {
            // Converte string ISO → Date
            if (res?.aulas?.length) {
              res.aulas = res.aulas.map((aula: any) => ({
                ...aula,
                dataAula: new Date(aula.dataAula),
              }));
            }
            this.aluno = res;
            this.alunoBasico = this.extrairAlunoBasicoInformacoesBasicas();

            if (aulaId) {
              const aulaSelecao: Aula | undefined = this.aluno.aulas.find(
                (aula) => aula.id === Number(aulaId)
              );
              this.selecionarAula(aulaSelecao!);
            }
          },
          complete: () => {},
        });
      }
    });
  }

  abrirModalNovaAula() {
    this.modalNovaAulaVisivel = true;
  }

  fechaModalNovaAula() {
    this.modalNovaAulaVisivel = false;
  }

  // voltar(): void {
  //   this.loggerService.info('Vai vltar para:' + this.origem);

  //   if (this.origem) {
  //     this.router.navigate([this.origem]);
  //   } else {
  //     this.router.navigate(['/listar']);
  //   }
  // }

  onSalvarAula(aula: Aula): void {
    this.aulaService.incluirAula(aula, this.aluno!.id).subscribe({
      next: (res) => {
        if (!this.aluno!.aulas) {
          this.aluno!.aulas = [];
        }
        this.aluno!.aulas.push(aula);

        this.reordenarAulasPorData();
        this.fechaModalNovaAula();
        this.toastService.success(res.mensagem);
      },
      complete: () => {},
    });
  }

  selecionarAula(aula: Aula): void {
    this.aulaSelecionada = aula;
    this.modalNovaDetalharAulaVisivel = true;
  }

  fechaModalDetalharAula(): void {
    this.aulaSelecionada = null;
    this.modalNovaDetalharAulaVisivel = false;
  }

  finalizarEditarModalDetalharAula(aula: Aula): void {
    this.aulaService.atualizarAula(this.aluno!.id, aula).subscribe({
      next: (res) => {
        const index = this.aluno!.aulas.findIndex((a) => a.id === aula.id);

        if (index !== -1) {
          this.aluno!.aulas[index] = aula;
        }

        this.reordenarAulasPorData();

        this.fechaModalDetalharAula();
        this.toastService.success(res.mensagem);
      },
      complete: () => {},
    });
  }

  onEditarInformacoesBasicas(alunoEditado: AlunoBasico): void {
    this.aluno = {
      ...this.aluno!, // mantém os dados já existentes (inclusive listas)
      ...alunoEditado, // sobrescreve apenas os campos do AlunoBasico
    };
    this.alunoBasico = alunoEditado;
  }

  onEditarIdiomas(idiomas: Idioma[]) {
    this.aluno!.idiomas = idiomas;
  }

  extrairAlunoBasicoInformacoesBasicas(): AlunoBasico {
    const {
      id,
      mora,
      idade,
      cidadeNatal,
      familia,
      profissao,
      hobbies,
      linkPerfil,
      pontos,
      paisMora,
      paisNatal,
      dataAniversario,
    } = this.aluno!;

    return {
      id,
      mora,
      idade,
      cidadeNatal,
      familia,
      profissao,
      hobbies,
      linkPerfil,
      pontos,
      paisMora,
      paisNatal,
      dataAniversario,
    } as AlunoBasico;
  }

  reordenarAulasPorData() {
    this.aluno!.aulas.sort((a, b) => {
      return new Date(b.dataAula).getTime() - new Date(a.dataAula).getTime();
    });
  }

  abrirModalAtualizarFoto() {
    this.modalAtualizarFotoVisivel = true;
  }

  atualizarFoto(urlImagemNova: string) {
    this.aluno!.fotoUrl = urlImagemNova;
    this.modalAtualizarFotoVisivel = false;
  }
}
