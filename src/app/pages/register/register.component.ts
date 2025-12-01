import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // SOLUCIONA ERROR ngModel
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  carreras: any[] = [];
  confirmarContrasena = '';
  esTutor = false;
  formData = { no_control: '', nombre: '', apellido: '', semestre: '', carrera: '', contrasena: '' };

  constructor(private api: ApiService, private router: Router, private toast: ToastService) {}

  ngOnInit() {
    this.api.get('get/getCareers.php').subscribe({
      next: (data) => this.carreras = data,
      error: () => this.toast.show('Error al cargar carreras', 'error')
    });
  }

  handleRegister() {
    // Validaciones omitidas por brevedad (iguales a antes)
    if (this.formData.contrasena !== this.confirmarContrasena) {
        this.toast.show('Las contraseñas no coinciden', 'error');
        return;
    }

    const endpoint = this.esTutor ? 'post/register_tutor.php' : 'post/register_tutorado.php';
    this.api.postForm(endpoint, this.formData).subscribe({
      next: () => {
        this.toast.show('Registro exitoso', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 409) this.toast.show('Usuario ya registrado', 'error');
        else this.toast.show('Error en registro', 'error');
      }
    });
  }
}