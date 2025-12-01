import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.css']
})
export class RatingModalComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() temaTutoria = ''; // Esta propiedad faltaba en la definición
  @Output() close = new EventEmitter<void>();
  @Output() submitRating = new EventEmitter<number>();

  currentRating = 0;
  starValues = [5, 4, 3, 2, 1];

  constructor(private toast: ToastService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && !changes['isVisible'].currentValue) {
      this.currentRating = 0;
    }
  }

  setRating(value: number) { this.currentRating = value; }
  closeModal() { this.close.emit(); }
  onOverlayClick(e: MouseEvent) { if (e.target === e.currentTarget) this.closeModal(); }

  submit() {
    if (this.currentRating === 0) {
      this.toast.show('Selecciona una calificación.', 'error');
      return;
    }
    this.submitRating.emit(this.currentRating);
  }
}