import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // SOLUCIONA ERROR ngModel
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register-tutoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-tutoria.component.html',
  styleUrls: ['./register-tutoria.component.css']
})
export class RegisterTutoriaComponent {
  today = new Date().toISOString().split('T')[0];
  tutoria = { tema_tutoria: '', detalles: '', fecha: '', hora_inicio: '', hora_fin: '', salon: '' };

  constructor(private api: ApiService, private router: Router, private toast: ToastService) {}

  addTutoria() {
    if (this.tutoria.hora_inicio >= this.tutoria.hora_fin) {
      this.toast.show('Hora fin debe ser mayor a inicio', 'error');
      return;
    }
    this.api.postForm('post/register_tutoria.php', this.tutoria).subscribe({
      next: () => {
        this.toast.show('Tutoría creada', 'success');
        this.router.navigate(['/dashboard/tutor']);
      },
      error: () => this.toast.show('Error al crear tutoría', 'error')
    });
  }
}