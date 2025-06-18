import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Idioma } from '../models/idioma';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IdiomaService {
  private baseUrl = environment.apiUrl + '/idiomas';

  constructor(private http: HttpClient) {}

  getIdiomas(): Observable<Idioma[]> {
    return this.http.get<Idioma[]>(this.baseUrl + '/');
  }

  atualizarIdiomasAluno(idAluno: number, idiomas: Idioma[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/${idAluno}`, idiomas);
  }
}
