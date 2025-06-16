import { Routes } from '@angular/router';
import { ListarAlunos } from './pages/listar-alunos/listar-alunos';
import { CadastrarAluno } from './pages/cadastrar-aluno/cadastrar-aluno';
import { DetalheAluno } from './pages/detalhe-aluno/detalhe-aluno';

export const routes: Routes = [
  { path: 'listar', component: ListarAlunos },
  {
    path: '',
    redirectTo: 'alunos',
    pathMatch: 'full',
  },
  { path: 'alunos/cadastrar', component: CadastrarAluno },
  { path: 'alunos/:id', component: DetalheAluno },
];
