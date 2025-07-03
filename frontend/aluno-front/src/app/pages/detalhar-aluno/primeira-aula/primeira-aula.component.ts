import { CommonModule } from '@angular/common';
import { AfterContentChecked, Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { Aluno } from '../../../models/aluno';
import { AlunoService } from '../../../services/aluno.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-primeira-aula',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarModule],
  templateUrl: './primeira-aula.component.html',
  styleUrl: './primeira-aula.component.css',
})
export class PrimeiraAulaComponent implements OnInit {
  editandoAlunoDesde: boolean = false;
  @Input() aluno!: Aluno;

  form!: FormGroup;
  hoje: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private alunoService: AlunoService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      dataPrimeiraAula: [
        this.aluno.dataPrimeiraAula
          ? new Date(this.aluno.dataPrimeiraAula)
          : undefined,
        Validators.required,
      ],
    });
  }

  cancelarEdicaoDesde() {
    this.editandoAlunoDesde = false;
  }

  executarEdicaoAlunoDesde() {
    if (this.editandoAlunoDesde) {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      const dataPrimeiraAula = this.form.value.dataPrimeiraAula;
      this.alunoService.alunoDesde(this.aluno.id, dataPrimeiraAula).subscribe({
        next: (res) => {
          this.toastService.success(res.mensagem);
          this.aluno.dataPrimeiraAula = dataPrimeiraAula;
        },
        complete: () => {},
      });
    }
    this.editandoAlunoDesde = !this.editandoAlunoDesde;
  }
}
