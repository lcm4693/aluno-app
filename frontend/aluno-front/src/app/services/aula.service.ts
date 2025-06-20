import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aula } from '../models/aula';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AulaService {
  private baseUrl = environment.apiUrl + '/aulas';

  constructor(private http: HttpClient) {}

  incluirAula(aula: Aula, idAluno: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${idAluno}`, aula);
  }
}
