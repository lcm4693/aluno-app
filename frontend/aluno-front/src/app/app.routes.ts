import { Routes } from '@angular/router';
import { ListarAlunosComponent } from './pages/listar-alunos/listar-alunos.component';
import { CadastrarAlunoComponent } from './pages/cadastrar-aluno/cadastrar-aluno.component';
import { DetalharAlunoComponent } from './pages/detalhar-aluno/detalhar-aluno.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/guard/auth.guard';
import { CalendarioAulasComponent } from './pages/calendario-aulas/calendario-aulas.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  {
    path: 'listar',
    component: ListarAlunosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'alunos/cadastrar',
    component: CadastrarAlunoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'alunos/:id',
    component: DetalharAlunoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'calendario-aulas',
    component: CalendarioAulasComponent,
    canActivate: [authGuard],
  },
];
