import { Productsinterface } from '../../core/models/products';
import { PercentgePipe } from '../../shared/percentge-pipe';
import { StarsPipe } from '../../shared/stars-pipe';
import { Component, input, inject, signal, computed } from '@angular/core';
import { Cart } from '../../core/services/cart';
import { Wishlist } from '../../core/services/wishlist';
import { switchMap, tap } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-featureproducts',
  imports: [StarsPipe, PercentgePipe, RouterLink],
  templateUrl: './featureproducts.html',
  styleUrl: './featureproducts.css',
})
export class Featureproducts {
  products = input<Productsinterface[]>([])
  layout = input<'grid' | 'list'>('grid')
  private cart = inject(Cart);
  private wishlist = inject(Wishlist);
  wishlistVersion = signal(0);
  loadingProductId = signal<string | null>(null);
  successProductId = signal<string | null>(null);

  wishlistProductIds = computed(() => {
    this.wishlistVersion();
    const localItems = this.wishlist.getLocalWishlist();
    return new Set(localItems.map(item => item.productId));
  });

  isInWishlist(productId: string): boolean {
    return this.wishlistProductIds().has(productId);
  }

  isLoading(productId: string): boolean {
    return this.loadingProductId() === productId;
  }

  isSuccess(productId: string): boolean {
    return this.successProductId() === productId;
  }

  addToCart(product: Productsinterface): void {
    const token = localStorage.getItem('token');
    this.loadingProductId.set(product._id);
    this.successProductId.set(null);

    if (token) {
      this.cart.addToCart({ productId: product._id }).pipe(
        switchMap(() => {
          const localItem = this.getLocalItem(product._id);
          if (localItem && localItem.count > 1) {
            return this.cart.updatequantity({ count: localItem.count }, product._id).pipe(
              tap(() => this.removeLocalItem(product._id))
            );
          }
          this.removeLocalItem(product._id);
          return [null];
        })
      ).subscribe({
        next: () => {
          this.loadingProductId.set(null);
          this.successProductId.set(product._id);
          setTimeout(() => this.successProductId.set(null), 1500);
        },
        error: (err) => {
          console.error('Error adding to cart', err);
          this.loadingProductId.set(null);
        },
      });
    } else {
      this.addToLocalCart(product);
      this.loadingProductId.set(null);
      this.successProductId.set(product._id);
      setTimeout(() => this.successProductId.set(null), 1500);
    }
  }

  private addToLocalCart(product: Productsinterface): void {
    const cartStr = localStorage.getItem('cart');
    const cart: any[] = cartStr ? JSON.parse(cartStr) : [];
    const existingIndex = cart.findIndex(item => item.productId === product._id);
    if (existingIndex > -1) {
      cart[existingIndex].count += 1;
    } else {
      cart.push({
        productId: product._id,
        count: 1,
        price: product.price,
        product: {
          _id: product._id,
          id: product.id,
          title: product.title,
          imageCover: product.imageCover,
          category: { name: product.category?.name ?? '' },
        },
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private getLocalItem(productId: string): any | null {
    const cartStr = localStorage.getItem('cart');
    if (!cartStr) return null;
    const cart: any[] = JSON.parse(cartStr);
    return cart.find(item => item.productId === productId) ?? null;
  }

  private removeLocalItem(productId: string): void {
    const cartStr = localStorage.getItem('cart');
    if (!cartStr) return;
    const cart: any[] = JSON.parse(cartStr);
    const updated = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(updated));
  }

  addToWishlist(product: Productsinterface): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.wishlist.addToWishlistAndSync(product._id).subscribe({
        next: (res) => {
          this.wishlistVersion.update(v => v + 1);
          console.log('Product added to wishlist', res);
        },
        error: (err) => console.error('Error adding to wishlist', err),
      });
    } else {
      this.wishlist.addLocalWishlist(product);
      this.wishlistVersion.update(v => v + 1);
    }
  }

  removeFromWishlist(product: Productsinterface): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.wishlist.removeFromWishlistAndSync(product._id).subscribe({
        next: (res) => {
          this.wishlistVersion.update(v => v + 1);
          console.log('Product removed from wishlist', res);
        },
        error: (err) => console.error('Error removing from wishlist', err),
      });
    } else {
      this.wishlist.removeLocalWishlist(product._id);
      this.wishlistVersion.update(v => v + 1);
    }
  }

  toggleWishlist(product: Productsinterface): void {
    if (this.isInWishlist(product._id)) {
      this.removeFromWishlist(product);
    } else {
      this.addToWishlist(product);
    }
  }
}