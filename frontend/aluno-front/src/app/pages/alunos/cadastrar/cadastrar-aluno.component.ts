import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Idioma } from '../../../models/idioma';
import { TextareaModule } from 'primeng/textarea';
import { IdiomaService } from '../../../services/idioma.service';
import { AlunoService } from '../../../services/aluno.service';
import { ToastService } from '../../../services/toast.service';
import { PaisService } from '../../../services/pais.service';
import { Pais } from '../../../models/pais';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { Constants } from '../../../shared/constants';
import { LoggerService } from '../../../services/logger.service';
import { AlunoNotificationService } from '../../../services/aluno-notification.service';
import { TextUtils } from '../../../shared/utils/text-utils';

@Component({
  standalone: true,
  selector: 'app-cadastrar-aluno',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    ButtonModule,
    CardModule,
    TextareaModule,
    AutoCompleteModule,
    ImageCropperComponent,
  ],
  templateUrl: './cadastrar-aluno.component.html',
  styleUrl: './cadastrar-aluno.component.css',
})
export class CadastrarAlunoComponent implements OnInit {
  @ViewChild('imageContainer') imageContainerRef!: ElementRef;
  @ViewChild('pasteButton') pasteButtonRef!: ElementRef;
  @ViewChild('pasteListener') pasteListenerRef!: ElementRef;

  // imagemAtual: HTMLImageElement | null = null;
  // imagemBlob: Blob | null = null;
  idiomasDisponiveis: Idioma[] = [];

  form: FormGroup;

  niveis = Constants.niveis;

  paises: Pais[] = [];
  paisesFiltradosMoraPais: any[] = [];
  paisesFiltradosPaisNatal: any[] = [];

  imagemEvento: any;
  imagemCortada: Blob | null = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private idiomaService: IdiomaService,
    private paisService: PaisService,
    private alunoService: AlunoService,
    private toast: ToastService,
    private loggerService: LoggerService,
    private alunoNotificationService: AlunoNotificationService
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      mora: [''],
      moraPaisObj: [''],
      moraPais: [''],
      paisNatalObj: [''],
      cidadeNatal: [''],
      paisNatal: [''],
      familia: [''],
      profissao: [''],
      nivel: [null, Validators.required],
      idade: [null],
      hobbies: [''],
      pontos: [''],
      linkPerfil: [
        '',
        Validators.pattern(
          /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(:\d{1,5})?(\/.*)?$/i
        ),
      ],
      idiomas: [''],
    });
  }

  ngOnInit(): void {
    this.idiomaService.getIdiomas().subscribe({
      next: (res) => {
        this.idiomasDisponiveis = res;
      },
      complete: () => {},
    });

    this.paisService.getPaises().subscribe({
      next: (res) => {
        this.paises = res;
      },
    });
  }

  voltarInicio(): void {
    this.router.navigateByUrl('');
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Object.keys(this.form.controls).forEach((campo) => {
        const control = this.form.get(campo);
        if (control && control.invalid) {
          this.loggerService.debug(
            `Campo "${campo}" inválido. Erros:`,
            control.errors
          );
        }
      });
      return;
    }

    this.enviarFormulario();
  }

  enviarFormulario(): void {
    const formData = new FormData();
    const aluno = this.form.value;

    for (const campo in aluno) {
      if (aluno.hasOwnProperty(campo)) {
        if (campo === 'idade') {
          if (
            aluno.idade === null ||
            aluno.idade === '' ||
            isNaN(aluno.idade)
          ) {
            continue;
          }
        } else if (campo === 'idiomas' && aluno.idiomas) {
          aluno.idiomas.forEach((idioma: string) => {
            formData.append('idiomas', idioma);
          });
          continue;
        } else if (campo === 'moraPaisObj') {
          if (aluno.moraPaisObj != null && aluno.moraPaisObj.id != null) {
            formData.append('moraPais', aluno.moraPaisObj.id);
          }
          continue;
        } else if (campo === 'paisNatalObj') {
          if (aluno.paisNatalObj != null && aluno.paisNatalObj.id != null) {
            formData.append('paisNatal', aluno.paisNatalObj.id);
          }
          continue;
        }
        formData.append(campo, aluno[campo]);
      }
    }

    if (this.imagemCortada) {
      formData.append('foto', this.imagemCortada, 'foto.png');
    }

    this.alunoService.incluirAluno(formData).subscribe({
      next: (res) => {
        this.alunoNotificationService.notificarAlteracaoListaAluno();
        this.router.navigateByUrl('/listar');
        this.toast.success(res.mensagem);
      },
      error: (err) => {
        this.loggerService.error('Erro back:', err);
        const erros = err.error?.erros;

        if (Array.isArray(erros)) {
          for (const erro of erros) {
            const campo = erro.campo || 'Campo indefinido';
            const mensagem = erro.mensagem || 'Erro desconhecido';
            this.toast.error(`Erro em ${campo}`, mensagem);
          }
        } else {
          // Caso genérico
          this.toast.error('Erro', 'Não foi possível salvar o aluno');
        }
      },
      complete: () => {},
    });
  }

  cancelar(): void {
    this.router.navigateByUrl('/');
  }

  filtrarPaisMora(event: { query: string }) {
    const query = TextUtils.removerAcentos(
      event.query.toLowerCase().trim() || ''
    );
    this.paisesFiltradosMoraPais = this.paises.filter((pais) => {
      const nomePais = TextUtils.removerAcentos(pais.nome.toLowerCase());
      return nomePais.includes(query);
    });
  }

  filtrarPaisNatal(event: { query: string }) {
    const query = TextUtils.removerAcentos(
      event.query.toLowerCase().trim() || ''
    );
    this.paisesFiltradosPaisNatal = this.paises.filter((pais) => {
      const nomePais = TextUtils.removerAcentos(pais.nome.toLowerCase());
      return nomePais.includes(query);
    });
  }

  resetarCropper() {
    this.imagemEvento = null;
    this.imagemCortada = null;
    this.imagemCortada = null;
  }

  carregarImagem(event: any) {
    this.imagemEvento = null;
    this.cdRef.detectChanges(); // força o Angular a reagir
    this.imagemEvento = event;
  }

  onImageCropped(event: ImageCroppedEvent) {
    this.imagemCortada = event.blob ?? null;
  }

  colarImagem() {
    navigator.clipboard
      .read()
      .then((items) => {
        for (const item of items) {
          if (
            item.types.includes('image/png') ||
            item.types.includes('image/jpeg')
          ) {
            item.getType(item.types[0]).then((blob) => {
              const file = new File([blob], 'imagem-colada.png', {
                type: blob.type,
              });

              // ✅ Simular um input:file com FileList real
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);

              const fakeInputEvent = new Event('change');
              Object.defineProperty(fakeInputEvent, 'target', {
                writable: false,
                value: { files: dataTransfer.files },
              });

              this.carregarImagem(fakeInputEvent);
            });
            return;
          }
        }
        this.toast.error(
          'Erro ao colar imagem',
          'Nenhuma imagem encontrada na área de transferência'
        );
      })
      .catch((err) => {
        this.loggerService.error(
          'Erro ao acessar a área de transferência:',
          err
        );
        this.toast.error(
          'Erro ao colar imagem',
          'Não foi possível acessar a área de transferência. Isso requer HTTPS ou localhost'
        );
      });
  }
}
