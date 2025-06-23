import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Aula } from '../../../../models/aula';
import { dataNoFuturoValidator } from '../../../../validators';

@Injectable({
  providedIn: 'root',
})
export class AulaFormService {
  constructor(private fb: FormBuilder) {}

  createForm(aula?: Aula): FormGroup {
    return this.fb.group({
      dataAula: [
        aula?.dataAula || new Date(),
        [Validators.required, dataNoFuturoValidator()],
      ],
      anotacoes: [aula?.anotacoes || '', Validators.required],
      comentarios: [aula?.comentarios || ''],
      proximaAula: [aula?.proximaAula || ''],
    });
  }

  getAulaFromForm(form: FormGroup): Aula {
    const controls = form.controls;

    const aula = new Aula({
      dataAula: controls['dataAula'].value,
      anotacoes: controls['anotacoes'].value,
      comentarios: controls['comentarios'].value,
      proximaAula: controls['proximaAula'].value,
    });

    return aula;
  }
}
