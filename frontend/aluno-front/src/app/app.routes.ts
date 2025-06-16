import { Routes } from '@angular/router';
import { ListarAlunosComponent } from './pages/listar-alunos/listar-alunos.component';
import { CadastrarAlunoComponent } from './pages/cadastrar-aluno/cadastrar-aluno.component';
import { DetalharAlunoComponent } from './pages/detalhar-aluno/detalhar-aluno.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'listar', component: ListarAlunosComponent },
  { path: 'alunos/cadastrar', component: CadastrarAlunoComponent },
  { path: 'alunos/:id', component: DetalharAlunoComponent },
];
