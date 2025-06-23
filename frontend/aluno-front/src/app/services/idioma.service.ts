import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Idioma } from '../models/idioma';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class IdiomaService {
  private baseUrl = environment.apiUrl + '/idiomas';

  constructor(private http: HttpClient, private cache: CacheService) {}

  getIdiomas(): Observable<Idioma[]> {
    if (this.cache.idiomas) {
      return of(this.cache.idiomas);
    }
    return this.http
      .get<Idioma[]>(this.baseUrl + '/')
      .pipe(tap((idiomas) => (this.cache.idiomas = idiomas)));
  }

  atualizarIdiomasAluno(idAluno: number, idiomas: Idioma[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/${idAluno}`, idiomas);
  }
}
