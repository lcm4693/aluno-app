import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Idioma } from '../models/idioma';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class IdiomaService {
  private baseUrl = environment.apiUrl + '/api';

  constructor(private http: HttpClient) {}

  getIdiomas(): Observable<Idioma[]> {
    return this.http.get<Idioma[]>(this.baseUrl + '/idiomas');
  }

  atualizarIdiomasAluno(idAluno: number, idiomas: Idioma[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/idiomas/${idAluno}`, idiomas);
  }
}
