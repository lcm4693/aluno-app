import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AulaFormComponent } from '../aula-form/aula-form.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Aula } from '../../../../../models/aula';
import { AulaFormService } from '../../services/aula-form.service';
import { EditarAulaComponent } from '../editar-aula/editar-aula.component';

@Component({
  selector: 'app-visualizar-aula',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AulaFormComponent,
    EditarAulaComponent,
  ],
  templateUrl: './visualizar-aula.component.html',
})
export class VisualizarAulaComponent implements OnChanges {
  @Input() aula!: Aula | null;
  @Output() fechar = new EventEmitter<void>();

  form: FormGroup;
  modo: 'editar' | 'visualizar' = 'visualizar';

  constructor(private formService: AulaFormService) {
    this.form = this.formService.createForm();
  }

  ngOnChanges(): void {
    if (this.aula) {
      this.form.patchValue(this.aula);
      this.form.disable();
    }
  }
}
