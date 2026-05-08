import { Injectable, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth';
import { Cart } from './cart';
import { Wishlist } from './wishlist';
import { cartCount, wishlistCount } from './cart-wishlist-signals';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CartWishlistState {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(Cart);
  private readonly wishlistService = inject(Wishlist);

  readonly cartCount = cartCount;
  readonly wishlistCount = wishlistCount;

  constructor() {
    this.loadFromLocalStorage();
    this.syncIfAuthenticated();
  }

  private loadFromLocalStorage(): void {
    if (!this.isBrowser) return;

    const cartStr = localStorage.getItem('cart');
    if (cartStr) {
      try {
        const cart = JSON.parse(cartStr);
        if (Array.isArray(cart)) {
          cartCount.set(cart.length);
        } else {
          cartCount.set(0);
        }
      } catch {
        cartCount.set(0);
      }
    } else {
      cartCount.set(0);
    }

    const wishlistStr = localStorage.getItem('wishlist');
    if (wishlistStr) {
      try {
        const wishlist = JSON.parse(wishlistStr);
        if (Array.isArray(wishlist)) {
          wishlistCount.set(wishlist.length);
        } else {
          wishlistCount.set(0);
        }
      } catch {
        wishlistCount.set(0);
      }
    } else {
      wishlistCount.set(0);
    }
  }

  private syncIfAuthenticated(): void {
    if (!this.isBrowser) return;

    effect(() => {
      console.log('Auth state changed:', this.authService.isAuthenticated());
      if (this.authService.isAuthenticated()) {
        console.log('User authenticated, fetching counts from API');
        this.refreshCartCount();
        this.refreshWishlistCount();
      } else {
        console.log('User not authenticated, loading from localStorage');
        this.loadFromLocalStorage();
      }
    });
  }

  refreshCartCount(): void {
    this.cartService.getuserCart().pipe(
      tap((res: any) => {
        const items = res.data?.products || res.data || [];
        if (Array.isArray(items)) {
          cartCount.set(items.length);
        }
      }),
    ).subscribe();
  }

  refreshWishlistCount(): void {
    this.wishlistService.getWishlist().pipe(
      tap((res: any) => {
        const items = res.data?.products || res.data || [];
        if (Array.isArray(items)) {
          wishlistCount.set(items.length);
        }
      }),
    ).subscribe();
  }
}