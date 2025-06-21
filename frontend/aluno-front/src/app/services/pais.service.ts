import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pais } from '../models/pais';

@Injectable({
  providedIn: 'root',
})
export class PaisService {
  private baseUrl = environment.apiUrl + '/paises';

  constructor(private http: HttpClient) {}

  getPaises(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.baseUrl + '/');
  }
}
