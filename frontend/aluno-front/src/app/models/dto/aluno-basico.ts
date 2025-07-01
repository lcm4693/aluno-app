import { Pais } from '../pais';

export interface AlunoBasico {
  id: number;
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
