import { Routes } from '@angular/router';
import { CadastrarAlunoComponent } from './pages/alunos/cadastrar/cadastrar-aluno.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/guard/auth.guard';
import { ListarAlunosComponent } from './pages/alunos/listar/listar-alunos.component';
import { DetalharAlunoComponent } from './pages/alunos/detalhar/detalhar-aluno.component';
import { CalendarioAulasComponent } from './pages/aulas/calendario-aulas/calendario-aulas.component';
import { CadastrarUsuarioComponent } from './pages/usuarios/cadastrar-usuario/cadastrar-usuario.component';

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
    path: 'aulas/calendario',
    component: CalendarioAulasComponent,
    canActivate: [authGuard],
  },
  {
    path: 'usuarios/cadastrar',
    component: CadastrarUsuarioComponent,
    canActivate: [authGuard],
  },
];
