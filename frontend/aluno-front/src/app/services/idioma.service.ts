import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Idioma } from '../models/idioma';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IdiomaService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  getIdiomas(): Observable<Idioma[]> {
    return this.http.get<Idioma[]>(this.baseUrl + '/idiomas');
  }

  atualizarIdiomasAluno(idAluno: number, idiomas: Idioma[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/idiomas/${idAluno}`, idiomas);
  }
}
