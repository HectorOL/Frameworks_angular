import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isHomePage = false;
  isTutorDashboard = false;
  isTutoradoDashboard = false;
  isRegisterTutoria = false;
  isAuthPage = false;

  constructor(private router: Router, private api: ApiService, private toast: ToastService) {}

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.isHomePage = url === '/';
      this.isTutorDashboard = url.includes('/dashboard/tutor');
      this.isTutoradoDashboard = url.includes('/dashboard/tutorado');
      this.isRegisterTutoria = url.includes('/register-tutoria');
      this.isAuthPage = ['/login', '/register'].includes(url);
    });
  }

  logout() {
    this.api.get('get/logout.php').subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        this.toast.show("Error al cerrar sesión", "error");
        this.router.navigate(['/login']);
      }
    });
  }
}