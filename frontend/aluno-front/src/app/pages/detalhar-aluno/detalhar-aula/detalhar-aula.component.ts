import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Calendar, CalendarModule } from 'primeng/calendar';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Aula } from '../../../models/aula';
import { dataNoFuturoValidator } from '../../../validators';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-detalhar-aula',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PanelModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextareaModule,
  ],
  templateUrl: './detalhar-aula.component.html',
  styleUrl: './detalhar-aula.component.css',
})
export class DetalharAulaComponent implements AfterViewInit, OnChanges {
  @ViewChild('topo') topoRef!: ElementRef;

  @Input() aula!: Aula | null;
  @Output() editarAula = new EventEmitter<Aula>();
  @Output() fechar = new EventEmitter<void>();

  editando: boolean = false;

  form: FormGroup;
  hoje: Date = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      dataAula: [
        { value: this.aula?.dataAula || new Date(), disabled: !this.editando },
        [Validators.required, dataNoFuturoValidator()],
      ],
      anotacoes: [this.aula?.anotacoes, Validators.required],
      comentarios: [this.aula?.comentarios],
      proximaAula: [this.aula?.proximaAula],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.aula) {
      console.log('AULA NO ngOnChanges DETALHAR AULA: ', this.aula);

      this.retornarValoresPadraoAula();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.topoRef?.nativeElement?.focus();
    }, 0);
  }

  alterarFlagEdicao() {
    this.editando = true;
    this.form.get('dataAula')?.enable();
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
    } else {
      this.aula!.dataAula = this.form.get('dataAula')?.value;
      this.aula!.anotacoes = this.form.get('anotacoes')?.value;
      this.aula!.comentarios = this.form.get('comentarios')?.value;
      this.aula!.proximaAula = this.form.get('proximaAula')?.value;
      // this.editarAula.emit(this.aula!);
      this.editando = false;
      this.editarAula.emit(this.aula!);
    }
  }

  retornarValoresPadraoAula() {
    this.form.patchValue({
      dataAula: this.aula?.dataAula,
      anotacoes: this.aula?.anotacoes,
      comentarios: this.aula?.comentarios,
      proximaAula: this.aula?.proximaAula,
    });
  }

  onCancel(): void {
    this.editando = false;
    this.retornarValoresPadraoAula();
    this.form.get('dataAula')?.disable();
  }
}
