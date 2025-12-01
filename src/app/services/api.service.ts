import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Ajusta esto si tu carpeta está en otro lugar
  private baseUrl = 'http://localhost/tutoriasJquery/src/controllers';

  constructor(private http: HttpClient) { }

  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, { withCredentials: true });
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, { withCredentials: true });
  }

  // Para Login y Registro (Form Data)
  postForm(endpoint: string, data: any): Observable<any> {
    const body = new URLSearchParams(data).toString();
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(`${this.baseUrl}/${endpoint}`, body, { headers, withCredentials: true });
  }
}