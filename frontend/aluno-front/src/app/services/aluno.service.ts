import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno';
import { environment } from '../../environments/environment';
import { AlunoBasico } from '../models/dto/aluno-basico';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private baseUrl = environment.apiUrl + '/alunos';

  constructor(private http: HttpClient) {}

  getAlunos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(`${this.baseUrl}/`);
  }

  getAlunosParaMenu(): Observable<
    { id: number; nome: string; fotoUrl: string }[]
  > {
    return this.http.get<{ id: number; nome: string; fotoUrl: string }[]>(
      `${this.baseUrl}/lista-menu`
    );
  }

  incluirAluno(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl + '/incluir', formData);
  }

  getAluno(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.baseUrl}/${id}`);
  }

  atualizarAluno(idAluno: number, aluno: AlunoBasico): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/informacoes-basicas/${idAluno}`,
      aluno
    );
  }

  excluirAluno(idAluno: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idAluno}`);
  }

  alunoDesde(idAluno: number, dataPrimeiraAula: Date): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/primeira-aula/${idAluno}`,
      dataPrimeiraAula
    );
  }

  uploadFoto(idAluno: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload-foto/${idAluno}`, formData);
  }
}
