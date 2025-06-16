import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aula } from '../models/aula';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AulaService {
  private baseUrl = '/api/aulas';

  constructor(private http: HttpClient) {}

  incluirAula(aula: Aula, idAluno: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${idAluno}`, aula);
  }
}
