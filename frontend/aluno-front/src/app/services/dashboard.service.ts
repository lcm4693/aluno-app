import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estatisticas } from '../models/estatisticas';
import { AlunoFavorito } from '../models/alunoFavorito';
import { UltimasAulas } from '../models/ultimas_aulas';
import { Notificacao } from '../models/notificacoes/notificacao';
import { SKIP_LOADING } from '../shared/loading-context.token';

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

  getAlunosFavoritos(): Observable<AlunoFavorito[]> {
    return this.http.get<AlunoFavorito[]>(
      `${this.baseUrl}` + '/alunos-favoritos'
    );
  }

  getUltimasAulas(): Observable<UltimasAulas[]> {
    return this.http.get<UltimasAulas[]>(`${this.baseUrl}` + '/ultimas-aulas');
  }

  geNotificacoes(): Observable<Notificacao> {
    return this.http.get<Notificacao>(`${this.baseUrl}` + '/notificacoes', {
      context: new HttpContext().set(SKIP_LOADING, true),
    });
  }
}
