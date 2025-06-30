import { Pais } from '../../../../models/pais';

export interface AlunoBasico {
  mora: string;
  idade: number;
  cidadeNatal: string;
  familia: string;
  profissao: string;
  hobbies: string;
  linkPerfil: string;
  pontos: string;
  paisMora: Pais | undefined;
  paisNatal: Pais | undefined;
  dataAniversario: Date;
}
