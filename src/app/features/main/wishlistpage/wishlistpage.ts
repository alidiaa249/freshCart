import { Cart } from './../../../core/services/cart';
import { Wishlist } from './../../../core/services/wishlist';
import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-wishlistpage',
  imports: [RouterLink, CommonModule],
  templateUrl: './wishlistpage.html',
  styleUrl: './wishlistpage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Wishlistpage implements OnInit {
  private wishlistService = inject(Wishlist);
  private cartService = inject(Cart);
  private platformId = inject(PLATFORM_ID);

  wishlistItems = signal<any[]>([]);
  isLoading = signal(true);
  error = signal<string|null>(null);
  isLoggedIn = signal(false);
  isBrowser = isPlatformBrowser(this.platformId);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadWishlist();
    } else {
      this.isLoading.set(false);
    }
  }

  loadWishlist(): void {
    this.isLoading.set(true);
    this.error.set(null);

    if (!this.isBrowser) {
      this.isLoading.set(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.loadLocalWishlist();
      return;
    }

    // Has token: sync localStorage items to backend, then fetch from API
    this.wishlistService.syncLocalWishlistToBackend().subscribe({
      next: () => this.fetchFromApi(),
      error: () => {
        this.error.set('Failed to sync local items. Showing local data.');
        this.loadLocalWishlist();
      }
    });
  }

  private fetchFromApi(): void {
    this.wishlistService.refreshLocalFromApi().subscribe({
      next: (res: any) => {
        const items = res.data?.products || res.data || [];
        this.wishlistItems.set(items);
        this.isLoggedIn.set(true);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load from server. Showing local data.');
        this.loadLocalWishlist();
      }
    });
  }

  private loadLocalWishlist(): void {
    const localItems = this.wishlistService.getLocalWishlist();
    // Ensure local items have `id` field so template works for both API and local
    const itemsWithId = localItems.map(item => ({
      ...item,
      id: item.productId,
    }));
    this.wishlistItems.set(itemsWithId);
    this.isLoggedIn.set(false);
    this.isLoading.set(false);
  }

  removeItem(id: string): void {
    if (!this.isBrowser) return;

    // Find item by id or productId to get the actual productId
    const item = this.wishlistItems().find(i =>
      i.id === id || i.productId === id || i.product?._id === id
    );
    if (!item) return;

    const productId = item.productId || item.product?._id || item.id;
    const token = localStorage.getItem('token');

    if (token) {
      this.isLoading.set(true);
      this.wishlistService.removeFromWishlistAndSync(productId).subscribe({
        next: (res: any) => {
          const items = res.data?.products || res.data || [];
          this.wishlistItems.set(items);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to remove item.');
          this.isLoading.set(false);
        }
      });
    } else {
      this.wishlistService.removeLocalWishlist(productId);
      this.loadLocalWishlist();
    }
  }

  addToCart(id: string): void {
    if (!this.isBrowser) return;

    // Find item by id or productId
    const item = this.wishlistItems().find(i =>
      i.id === id || i.productId === id || i.product?._id === id
    );

    if (!item) {
      this.error.set('Item not found.');
      return;
    }

    const productId = item.productId || item.product?._id || item.id;
    const token = localStorage.getItem('token');

    if (token) {
      this.cartService.addToCart({ productId }).subscribe({
        next: () => this.removeItem(id),
        error: () => this.error.set('Failed to add to cart.')
      });
    } else {
      if (!item.product) {
        this.error.set('Product details not found.');
        return;
      }

      // Add to local cart with same structure as featureproducts addToLocalCart
      const cartStr = localStorage.getItem('cart');
      const cart: any[] = cartStr ? JSON.parse(cartStr) : [];

      const existingIndex = cart.findIndex(ci => ci.productId === productId);
      if (existingIndex > -1) {
        cart[existingIndex].count += 1;
      } else {
        cart.push({
          productId: productId,
          count: 1,
          price: item.product.price,
          product: {
            _id: item.product._id || productId,
            id: item.product.id,
            title: item.product.title,
            imageCover: item.product.imageCover,
            category: { name: item.product.category?.name ?? '' }
          }
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      this.removeItem(id); // Remove from wishlist after adding to cart
      this.error.set(null);
    }
  }

  clearError(): void {
    this.error.set(null);
  }
}
