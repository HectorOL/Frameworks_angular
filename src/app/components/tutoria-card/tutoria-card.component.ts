import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tutoria-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutoria-card.component.html',
  styleUrls: ['./tutoria-card.component.css']
})
export class TutoriaCardComponent {
  @Input() tutoria: any; // <--- Importante que sea Input

  get isOcupado(): boolean {
    return this.tutoria?.tutorados && this.tutoria.tutorados.length > 0;
  }
}