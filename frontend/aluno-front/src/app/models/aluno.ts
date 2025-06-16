import { Aula } from './aula';
import { Idioma } from './idioma';

export class Aluno {
  constructor(
    public id: number,
    public nome: string,
    public nivel: string,
    public mora: string,
    public idade: number,
    public cidadeNatal: string,
    public familia: string,
    public profissao: string,
    public hobbies: string,
    public linkPerfil: string,
    // public imagemFoto: string,
    public pontos: string,
    public idiomas: Idioma[],
    public fotoUrl: string,
    public recomendacoes: string[],
    public notas: string[],
    public aulas: Aula[]
  ) {}
}
