import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { Idioma } from '../../../models/idioma';
import { HttpClient } from '@angular/common/http';
import { IdiomaService } from '../../../services/idioma.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-idiomas',
  standalone: true,
  imports: [CommonModule, FieldsetModule, CheckboxModule, FormsModule],
  templateUrl: './idiomas.component.html',
  styleUrl: './idiomas.component.css',
})
export class IdiomasComponent implements OnInit {
  modoEdicao: boolean = false;
  idiomasDisponiveis: Idioma[] = [];
  @Input() idiomasAluno!: Idioma[] | null;
  @Output() editarIdiomas = new EventEmitter<Idioma[]>();

  constructor(private idiomaService: IdiomaService) {}

  ngOnInit(): void {
    this.idiomaService.getIdiomas().subscribe({
      next: (res) => {
        this.idiomasDisponiveis = res;
      },
      complete: () => {},
    });
  }

  executarAcaoEdicao() {
    if (this.modoEdicao) {
      this.editarIdiomas.emit(this.idiomasAluno!);
    }

    this.modoEdicao = !this.modoEdicao;
  }

  cancelarEdicao() {
    this.modoEdicao = false;
  }
}
