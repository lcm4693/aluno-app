import { Aluno } from './aluno';

export class Aula {
  constructor(
    public dataAula: Date,
    public anotacoes: string,
    public comentarios?: string,
    public proximaAula?: Date,
    public aluno?: Aluno
  ) {}
}
