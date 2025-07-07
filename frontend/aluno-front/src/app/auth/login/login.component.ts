import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastService } from '../../services/toast.service';
import { UserStoreService } from '../services/user-store.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private authService: AuthService,
    private userStore: UserStoreService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      senha: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.toast.error('Preencha todos os campos corretamente');
      return;
    }

    this.loading = true;

    const { email, senha } = this.form.value;

    this.authService.login({ email, senha }).subscribe({
      next: (res) => {
        this.userStore.setUsuarioFromToken(res.access_token, res.refresh_token);
        this.toast.success('Login realizado com sucesso');
        this.router.navigate(['/']);
        // const usuario = this.userStore.getUsuario();
        // this.userStore.usuario$.subscribe((user) => {
        //   this.mostrarMenuAdmin = user?.is_admin ?? false;
        // });
      },
      error: () => {
        this.loading = false;
        this.toast.error('Credenciais inválidas');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
