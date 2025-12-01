import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutoriaCardComponent } from '../../components/tutoria-card/tutoria-card.component';
import { RatingModalComponent } from '../../components/rating-modal/rating-modal.component';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard-tutorado',
  standalone: true,
  imports: [CommonModule, TutoriaCardComponent, RatingModalComponent],
  templateUrl: './dashboard-tutorado.component.html',
  styleUrls: ['./dashboard-tutorado.component.css']
})
export class DashboardTutoradoComponent implements OnInit {
  tutorado: any = null;
  tutoriasDisponibles: any[] = [];
  tutoriasTutorado: any[] = [];
  
  tutoriasPorCarrera: { [key: string]: any[] } = {};
  carrerasDisponibles: string[] = [];
  activeTab: string = '';

  isModalVisible = false;
  tutoriaAcalificar: any = null;
  subscribingId: any = null;

  // Para ver datos en el HTML
  debugData: any = null;

  constructor(
    private api: ApiService, 
    private toast: ToastService,
    private cd: ChangeDetectorRef // <--- Inyección para actualizar la vista
  ) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.api.get('get/dashboard_tutorado.php').subscribe({
      next: (data) => {
        console.log('TUTORADO RAW DATA:', data);

        // 1. Asegurar que es objeto JSON
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.error('Error parseando JSON tutorado', e);
          }
        }

        this.debugData = data; // Para el cuadro negro

        // 2. Asignación segura
        this.tutorado = data.tutorado;
        this.tutoriasDisponibles = data.tutorias || [];
        this.tutoriasTutorado = data.tutorias_tutorado || [];

        // 3. Procesar lógica
        this.procesarTutoriasDisponibles();

        // 4. Forzar actualización de vista
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.toast.show("Error al cargar los datos.", "error");
      }
    });
  }

  haPasado(tutoria: any): boolean {
    if (!tutoria.fecha || !tutoria.hora_fin) return false;
    const horaLimpia = tutoria.hora_fin.split(".")[0];
    const fechaTutoria = new Date(`${tutoria.fecha}T${horaLimpia}`);
    return fechaTutoria < new Date();
  }

  procesarTutoriasDisponibles() {
    const idsInscritas = new Set(this.tutoriasTutorado.map(t => t.id_oferta));
    
    const filtradas = this.tutoriasDisponibles.filter(tutoria => 
      tutoria.estado.toLowerCase() === "d" &&
      !this.haPasado(tutoria) &&
      !idsInscritas.has(tutoria.id_oferta)
    );

    this.tutoriasPorCarrera = filtradas.reduce((acc: any, tutoria: any) => {
      const carrera = tutoria.nombre_carrera;
      if (!acc[carrera]) acc[carrera] = [];
      acc[carrera].push(tutoria);
      return acc;
    }, {});

    this.carrerasDisponibles = Object.keys(this.tutoriasPorCarrera);
    if (this.carrerasDisponibles.length > 0 && !this.activeTab) {
      this.activeTab = this.carrerasDisponibles[0];
    }
  }

  setActiveTab(carrera: string) {
    this.activeTab = carrera;
    this.cd.detectChanges(); // Actualizar al cambiar pestaña
  }

  abrirModalCalificacion(tutoria: any) {
    this.tutoriaAcalificar = tutoria;
    this.isModalVisible = true;
    this.cd.detectChanges();
  }

  cerrarModalCalificacion() {
    this.isModalVisible = false;
    this.tutoriaAcalificar = null;
    this.cd.detectChanges();
  }

  suscribirse(idOferta: any) {
    this.subscribingId = idOferta;
    this.api.postForm('post/subscribe_tutoria.php', { id_oferta: idOferta }).subscribe({
      next: (result) => {
        if (result && result.status === "success") {
          this.toast.show("¡Suscripción exitosa!", "success");
          this.fetchDashboardData(); 
        } else {
          this.toast.show(result.message || "Error al suscribirse", "error");
        }
        this.subscribingId = null;
        this.cd.detectChanges();
      },
      error: () => {
        this.toast.show("Error de conexión.", "error");
        this.subscribingId = null;
        this.cd.detectChanges();
      }
    });
  }

  enviarCalificacion(rating: number) {
    if (!this.tutoriaAcalificar) return;
    const datos = { id_oferta: this.tutoriaAcalificar.id_oferta, calificacion: rating };
    
    this.api.post('post/rate_tutoria.php', datos).subscribe({
      next: (result) => {
        if (result && result.success) {
          this.toast.show("¡Gracias por tu calificación!", "success");
          const index = this.tutoriasTutorado.findIndex(t => t.id_oferta === datos.id_oferta);
          if(index !== -1) this.tutoriasTutorado[index].calificado = true;
          this.cerrarModalCalificacion();
        } else {
          this.toast.show(result.message || "Error al calificar", "error");
        }
        this.cd.detectChanges();
      },
      error: () => {
        this.toast.show("Error de conexión", "error");
        this.cd.detectChanges();
      }
    });
  }
}