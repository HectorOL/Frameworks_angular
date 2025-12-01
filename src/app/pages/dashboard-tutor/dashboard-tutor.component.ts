import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TutoriaCardComponent } from '../../components/tutoria-card/tutoria-card.component';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard-tutor',
  standalone: true,
  imports: [CommonModule, RouterModule, TutoriaCardComponent],
  templateUrl: './dashboard-tutor.component.html',
  styleUrls: ['./dashboard-tutor.component.css']
})
export class DashboardTutorComponent implements OnInit {
  tutor: any = null;
  tutorias: any[] = [];
  selectedTutorado: any = null;
  
  // Variable para depuración en pantalla
  debugData: any = null;

  constructor(
    private api: ApiService, 
    private toast: ToastService,
    private cd: ChangeDetectorRef // Para forzar actualización de la vista
  ) {}

  ngOnInit() {
    this.api.get('get/dashboard_tutor.php').subscribe({
      next: (data) => {
        console.log('DATOS CRUDOS:', data);
        console.log('Tipo de dato:', typeof data);

        // Si data es un string (sucede si PHP tiene espacios extra), lo parseamos
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.error('Error parseando JSON manual', e);
          }
        }

        this.debugData = data; // Guardamos para ver en HTML

        // Asignación directa sin if restrictivo
        this.tutor = data.tutor;
        this.tutorias = data.tutorias || [];

        console.log('Variable tutor asignada:', this.tutor);
        console.log('Variable tutorias asignada:', this.tutorias);
        
        this.cd.detectChanges(); // Forzamos a Angular a pintar los cambios
      },
      error: (err) => {
        console.error('Error HTTP:', err);
        this.toast.show("Error al cargar dashboard", "error");
      }
    });
  }

  mostrarInfoTutorado(oferta: any) {
    if (oferta.tutorados && oferta.tutorados.length > 0) {
      this.selectedTutorado = oferta.tutorados[0];
    } else {
      this.selectedTutorado = null;
    }
  }
}