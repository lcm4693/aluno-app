import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pais } from '../models/pais';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class PaisService {
  private baseUrl = environment.apiUrl + '/paises';

  constructor(private http: HttpClient, private cache: CacheService) {}

  getPaises(): Observable<Pais[]> {
    if (this.cache.paises) {
      return of(this.cache.paises);
    }
    return this.http
      .get<Pais[]>(this.baseUrl + '/')
      .pipe(tap((paises) => (this.cache.paises = paises)));
  }
}
