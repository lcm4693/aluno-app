import { AniversarioAluno } from './aniversariosAluno';
import { AulaSemAnotacao } from './aulasSemAnotacao';

export class Notificacao {
  constructor(
    public aulasSemAnotacao: AulaSemAnotacao[],
    public aniversariosAlunos: AniversarioAluno[]
  ) {}
}
