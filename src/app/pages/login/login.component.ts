import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // SOLUCIONA ERROR ngModel
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  noControl = '';
  contrasena = '';

  constructor(private api: ApiService, private router: Router, private toast: ToastService) {}

  handleLogin() {
    if (!this.noControl || !this.contrasena) {
      this.toast.show('Completa todos los campos.', 'error');
      return;
    }
    const data = { no_control: this.noControl, contrasena: this.contrasena };

    this.api.postForm('post/login_user.php', data).subscribe({
      next: (result) => {
        if (result.success) {
          this.toast.show('Bienvenido', 'success');
          if (result.userType === 'tutor') this.router.navigate(['/dashboard/tutor']);
          else this.router.navigate(['/dashboard/tutorado']);
        } else {
          this.toast.show(result.message || 'Credenciales incorrectas.', 'error');
        }
      },
      error: () => this.toast.show('Error de servidor.', 'error')
    });
  }
}