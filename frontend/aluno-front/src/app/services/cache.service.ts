// cache.service.ts
import { Injectable } from '@angular/core';
import { Idioma } from '../models/idioma';
import { Pais } from '../models/pais';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  idiomas: Idioma[] | null = null;
  paises: Pais[] | null = null;

  limparCacheIdiomas() {
    this.idiomas = null;
  }

  limparCachePaises() {
    this.paises = null;
  }
}
