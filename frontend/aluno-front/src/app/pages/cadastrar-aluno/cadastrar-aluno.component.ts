import {
  AfterViewInit,
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
import interact from 'interactjs';
import { HttpClient } from '@angular/common/http';
import { Idioma } from '../../models/idioma';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { IdiomaService } from '../../services/idioma.service';
import { AlunoService } from '../../services/aluno.service';
import { ToastService } from '../../services/toast.service';

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
    InputTextareaModule,
  ],
  templateUrl: './cadastrar-aluno.component.html',
  styleUrl: './cadastrar-aluno.component.css',
})
export class CadastrarAlunoComponent implements AfterViewInit, OnInit {
  @ViewChild('imageContainer') imageContainerRef!: ElementRef;
  @ViewChild('pasteButton') pasteButtonRef!: ElementRef;
  @ViewChild('pasteListener') pasteListenerRef!: ElementRef;

  imagemAtual: HTMLImageElement | null = null;
  imagemBlob: Blob | null = null;
  idiomasDisponiveis: Idioma[] = [];

  form: FormGroup;

  niveis = [
    { label: 'A1', value: 'A1' },
    { label: 'A2', value: 'A2' },
    { label: 'B1', value: 'B1' },
    { label: 'B2', value: 'B2' },
    { label: 'C1', value: 'C1' },
    { label: 'C2', value: 'C2' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private idiomaService: IdiomaService,
    private alunoService: AlunoService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      mora: [''],
      cidadeNatal: [''],
      familia: [''],
      profissao: [''],
      nivel: [null, Validators.required],
      idade: [null],
      hobbies: [''],
      pontos: [''],
      linkPerfil: [''],
      idiomas: [''],
    });
  }

  ngAfterViewInit(): void {
    const pasteBtn = this.pasteButtonRef.nativeElement as HTMLButtonElement;
    const container = this.imageContainerRef.nativeElement as HTMLDivElement;

    pasteBtn.addEventListener('click', () => {
      navigator.clipboard
        .read()
        .then((items) => {
          for (const item of items) {
            if (
              item.types.includes('image/png') ||
              item.types.includes('image/jpeg')
            ) {
              item.getType(item.types[0]).then((blob) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  this.showImage(e.target?.result as string, container);
                };
                reader.readAsDataURL(blob);
              });
            }
          }
        })
        .catch((err) => {
          alert('Erro ao colar imagem. Tente Ctrl+V ou use outro navegador.');
        });
    });
  }

  showImage(dataUrl: string, container: HTMLElement) {
    if (this.imagemAtual) {
      this.imagemAtual.remove();
    }

    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.width = '200px';
    this.imagemAtual = img;
    container.appendChild(img);

    interact(img).resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
          });
        },
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 100, height: 100 },
          max: { width: 800, height: 800 },
        }),
      ],
    });
  }

  ngOnInit(): void {
    this.idiomaService.getIdiomas().subscribe({
      next: (res) => {
        this.idiomasDisponiveis = res;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
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
          console.warn(`Campo "${campo}" inválido. Erros:`, control.errors);
        }
      });
      return;
    }

    if (this.imagemAtual) {
      const canvas = document.createElement('canvas');
      canvas.width = this.imagemAtual.width; // usa dimensões visuais finais
      canvas.height = this.imagemAtual.height;

      const ctx = canvas.getContext('2d');

      const imagem = new Image();
      imagem.onload = () => {
        ctx?.drawImage(imagem, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            console.log('Imagem convertida em Blob com sucesso.');
            this.imagemBlob = blob;
            this.enviarFormulario();
          }
        }, 'image/png');
      };

      imagem.src = this.imagemAtual.src;
    } else {
      this.enviarFormulario();
    }
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
        }
        formData.append(campo, aluno[campo]);
      }
    }

    if (this.imagemBlob) {
      formData.append('foto', this.imagemBlob, 'foto.png');
    }

    this.alunoService.incluirAluno(formData).subscribe({
      next: () => {
        this.router.navigateByUrl('/listar');
      },
      error: (err) => {
        console.log('Erro back:', err);
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
}
