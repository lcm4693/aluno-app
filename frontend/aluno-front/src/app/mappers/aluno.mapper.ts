import { FormGroup } from '@angular/forms';
import { Pais } from '../models/pais';
import { AlunoBasico } from '../models/dto/aluno-basico';

export class AlunoMapper {
  static fromForm(
    form: FormGroup,
    paisMora: Pais,
    paisNatal: Pais,
    id: number
  ): AlunoBasico {
    const f = form.value;
    return {
      id,
      mora: f.mora,
      idade: f.idade,
      cidadeNatal: f.cidadeNatal,
      familia: f.familia,
      profissao: f.profissao,
      hobbies: f.hobbies,
      linkPerfil: f.linkPerfil,
      pontos: f.pontos,
      paisMora,
      paisNatal,
      dataAniversario: f.dataAniversario,
    };
  }
}
