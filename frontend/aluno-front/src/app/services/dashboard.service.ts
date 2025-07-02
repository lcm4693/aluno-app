import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estatisticas } from '../models/estatisticas';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) {}

  getCardsEstatisticas(): Observable<Estatisticas> {
    return this.http.get<Estatisticas>(
      `${this.baseUrl}` + '/cards-estatisticas'
    );
  }
}
