import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlunoNotificationService {
  constructor() {}

  private listaAlunosAlteradaSubject = new Subject<void>();
  listaAlunosAlterada$ = this.listaAlunosAlteradaSubject.asObservable();

  notificarAlteracaoListaAluno() {
    this.listaAlunosAlteradaSubject.next();
  }
}
