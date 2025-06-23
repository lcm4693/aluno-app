import { Aluno } from './aluno';

export class Aula {
  constructor(
    public id: number,
    public dataAula: Date,
    public anotacoes: string,
    public comentarios?: string,
    public proximaAula?: Date,
    public aluno?: Aluno
  ) {}
}
