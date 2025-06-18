import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno';
import { AlunoBasico } from '../pages/detalhar-aluno/informacoes-basicas/dto/aluno-informacoes-basicas';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private baseUrl = environment.apiUrl + '/api/alunos';

  constructor(private http: HttpClient) {}

  getAlunos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(`${this.baseUrl}`);
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

  buscarFotoAlunoPorNome(nomeFoto: string): Observable<Blob> {
    return this.http.get(`api/fotos/${nomeFoto}`, {
      responseType: 'blob',
    });
  }
}
