import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/services/user';
import { AuthService } from '../../../core/services/auth';
import { ChangeDetectionStrategy } from '@angular/core';
import { order } from './order';

@Component({
  selector: 'app-allorders',
  imports: [CommonModule],
  templateUrl: './allorders.html',
  styleUrl: './allorders.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Allorders {
  private readonly userService = inject(User);
  private readonly authService = inject(AuthService);

  readonly orders = signal<order[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly expandedOrders = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.userService.verifytoken().subscribe({
      next: (tokenRes: any) => {
        const userId = tokenRes.decoded?.id;
        if (!userId) {
          this.error.set(true);
          this.loading.set(false);
          return;
        }
        this.userService.getuserorders(userId).subscribe({
          next: (res: any) => {
            this.orders.set(res || []);
            console.log(res);

            this.loading.set(false);
          },
          error: () => {
            this.error.set(true);
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  toggleOrder(orderId: string): void {
    this.expandedOrders.update(set => {
      const next = new Set(set);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  }

  isExpanded(orderId: string): boolean {
    return this.expandedOrders().has(orderId);
  }
}