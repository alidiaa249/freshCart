import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToastService, Toast as ToastItem } from '../../services/toast';

@Component({
  selector: 'app-toast',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  host: {
    'style': 'position: fixed; top: 1rem; right: 1rem; z-index: 9999; display: block;'
  }
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  readonly toasts = this.toastService.toasts;

  trackById(_index: number, toast: ToastItem): number {
    return toast.id;
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}