import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { cartCount, wishlistCount } from './cart-wishlist-signals';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly isAuthenticated = signal(false);
  readonly user = signal<{ name: string; email: string; [key: string]: unknown } | null>(null);

  readonly userName = computed(() => this.user()?.name || this.user()?.['username'] || '');
  readonly userEmail = computed(() => this.user()?.email || '');

  constructor() {
    this.checkAuthState();
  }

  private checkAuthState(): void {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token) {
      this.isAuthenticated.set(true);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.user.set(user);
        } catch {
          this.user.set(null);
        }
      }
    } else {
      this.isAuthenticated.set(false);
      this.user.set(null);
    }
  }

  login(token: string, user: Record<string, unknown>): void {
    if (!this.isBrowser) return;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.isAuthenticated.set(true);
    this.user.set(user as { name: string; email: string; [key: string]: unknown });
  }

  logout(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticated.set(false);
    this.user.set(null);
  }



  
}