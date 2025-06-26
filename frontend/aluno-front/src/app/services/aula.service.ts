import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aula } from '../models/aula';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserStoreService } from '../auth/services/user-store.service';

@Injectable({
  providedIn: 'root',
})
export class AulaService {
  private baseUrl = environment.apiUrl + '/aulas';

  constructor(private http: HttpClient) {}

  incluirAula(aula: Aula, idAluno: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${idAluno}`, aula.objeto);
  }

  atualizarAula(idAluno: number, aula: Aula): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${idAluno}/${aula.id}`, aula);
  }

  listarAulas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/`);
  }
}
