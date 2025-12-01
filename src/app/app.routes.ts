import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardTutorComponent } from './pages/dashboard-tutor/dashboard-tutor.component';
import { DashboardTutoradoComponent } from './pages/dashboard-tutorado/dashboard-tutorado.component';
import { RegisterTutoriaComponent } from './pages/register-tutoria/register-tutoria.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard/tutor', component: DashboardTutorComponent },
  { path: 'dashboard/tutorado', component: DashboardTutoradoComponent },
  { path: 'register-tutoria', component: RegisterTutoriaComponent },
  { path: '**', redirectTo: '' }
];