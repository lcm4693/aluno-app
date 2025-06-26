import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { NovaAulaComponent } from './nova-aula/nova-aula.component';
import { CalendarModule } from 'primeng/calendar';
import { Aula } from '../../models/aula';
import { Aluno } from '../../models/aluno';
import { TooltipModule } from 'primeng/tooltip';
import { InformacoesBasicasComponent } from './informacoes-basicas/informacoes-basicas.component';
import { AlunoService } from '../../services/aluno.service';
import { AulaService } from '../../services/aula.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IdiomasComponent } from './idiomas/idiomas.component';
import { Idioma } from '../../models/idioma';
import { IdiomaService } from '../../services/idioma.service';
import { AlunoBasico } from './informacoes-basicas/dto/aluno-informacoes-basicas';
import { DetalharAulaComponent } from './detalhar-aula/detalhar-aula.component';
import { ToastService } from '../../services/toast.service';
import { InputTextModule } from 'primeng/inputtext';

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
    CalendarModule,
    DetalharAulaComponent,
    TooltipModule,
    InformacoesBasicasComponent,
    IdiomasComponent,
    InputTextModule,
  ],
  templateUrl: './detalhar-aluno.component.html',
  styleUrl: './detalhar-aluno.component.css',
})
export class DetalharAlunoComponent implements OnInit {
  aluno?: Aluno;

  //Usarei esse campo para passar somente as inf do fieldset informações pessoais
  alunoBasico!: AlunoBasico;

  aulaSelecionada: Aula | null = null;

  modalNovaAulaVisivel = false;
  modalNovaDetalharAulaVisivel = false;

  fotoAlunoUrl: SafeUrl | null = null;
  editandoAlunoDesde: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alunoService: AlunoService,
    private aulaService: AulaService,
    private idiomaService: IdiomaService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const alunoId = this.route.snapshot.paramMap.get('id');
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
        },
        complete: () => {},
      });
    }
  }

  abrirModalNovaAula() {
    this.modalNovaAulaVisivel = true;
  }

  fechaModalNovaAula() {
    this.modalNovaAulaVisivel = false;
  }

  voltarParaListagem(): void {
    this.router.navigate(['/listar']);
  }

  onSalvarAula(aula: Aula): void {
    this.aulaService.incluirAula(aula, this.aluno!.id).subscribe({
      next: (res) => {
        if (!this.aluno!.aulas) {
          this.aluno!.aulas = [];
        }
        this.aluno!.aulas.push(aula);
        this.reordenarAulasPorData();
        this.fechaModalNovaAula();
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
        this.fechaModalDetalharAula();
        this.toastService.success(res.mensagem);
      },
      complete: () => {},
    });
  }

  onEditarInformacoesBasicas(alunoEditado: AlunoBasico): void {
    this.alunoService.atualizarAluno(this.aluno!.id, alunoEditado).subscribe({
      next: (res) => {
        this.aluno = {
          ...this.aluno!, // mantém os dados já existentes (inclusive listas)
          ...alunoEditado, // sobrescreve apenas os campos do AlunoBasico
        };
        this.toastService.success(res.mensagem);
      },
      complete: () => {},
    });
  }

  onEditarIdiomas(idiomas: Idioma[]) {
    this.idiomaService
      .atualizarIdiomasAluno(this.aluno!.id, idiomas)
      .subscribe({
        next: (res) => {
          this.aluno!.idiomas = idiomas;
          this.toastService.success(res.mensagem);
        },
        complete: () => {},
      });
  }

  extrairAlunoBasicoInformacoesBasicas(): AlunoBasico {
    const {
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
    } = this.aluno!;

    return {
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
    } as AlunoBasico;
  }

  reordenarAulasPorData() {
    this.aluno!.aulas.sort((a, b) => {
      return new Date(b.dataAula).getTime() - new Date(a.dataAula).getTime();
    });
  }

  cancelarEdicaoDesde() {
    this.editandoAlunoDesde = false;
  }

  executarEdicaoAlunoDesde() {
    if (this.editandoAlunoDesde) {
      console.log('atualizar o campo');
    }

    this.editandoAlunoDesde = !this.editandoAlunoDesde;
  }
}
