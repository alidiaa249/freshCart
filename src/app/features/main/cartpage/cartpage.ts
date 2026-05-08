import { cartCount } from './../../../core/services/cart-wishlist-signals';
import { Cart } from '../../../core/services/cart';
import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

interface LocalCartItem {
  productId: string;
  count: number;
  price: number;
  product: {
    _id: string;
    id: string;
    title: string;
    imageCover: string;
    category: { name: string };
  };
}

interface CartProduct {
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category: { name: string };
    price: number;
  };
  count: number;
  price: number;
}

@Component({
  selector: 'app-cartpage',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cartpage.html',
  styleUrl: './cartpage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cartpage implements OnInit {
  private cartService = inject(Cart);
  private platformId = inject(PLATFORM_ID);
  isLoggedIn = signal(false);
  cartItems = signal<CartProduct[]>([]);
  localCartItems = signal<LocalCartItem[]>([]);
  totalPrice = signal(0);
  loadingItemId = signal<string | null>(null);

  cartCount = computed(() => {
    if (this.isLoggedIn()) {
      return this.cartItems().reduce((sum, item) => sum + item.count, 0);
    }
    return this.localCartItems().reduce((sum, item) => sum + item.count, 0);
  });

  freeShippingThreshold = 500;
  progressPercent = computed(() => {
    const total = this.totalPrice();
    return Math.min((total / this.freeShippingThreshold) * 100, 100);
  });
  amountForFreeShipping = computed(() => {
    return Math.max(this.freeShippingThreshold - this.totalPrice(), 0);
  });
  hasFreeShipping = computed(() => this.totalPrice() >= this.freeShippingThreshold);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn.set(localStorage.getItem('token') !== null);
      this.loadCart();
    }
  }

  private loadCart(): void {
    if (this.isLoggedIn()) {
      this.cartService.getuserCart().subscribe({
        next: (res: any) => {
          this.cartItems.set(res.data.products);
          console.log(res);
          
          this.totalPrice.set(res.data.totalCartPrice);
        },
        error: () => this.loadLocalCart(),
      });
    } else {
      this.loadLocalCart();
    }
  }

  private loadLocalCart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const cartStr = localStorage.getItem('cart');
    if (cartStr) {
      const cart: LocalCartItem[] = JSON.parse(cartStr);
      this.localCartItems.set(cart);
      const total = cart.reduce((sum, item) => sum + item.price * item.count, 0);
      this.totalPrice.set(total);
    }
  }

  updateQuantity(productId: string, change: number): void {
    if (this.isLoggedIn()) {
      const item = this.cartItems().find(i => i.product._id === productId);
      if (item) {
        const newCount = item.count + change;
        if (newCount < 1) return;
        this.loadingItemId.set(productId);
        this.cartService.updatequantity({ count: newCount }, productId).subscribe({
          next: () => {
            this.loadingItemId.set(null);
            const updated = this.cartItems().map(i =>
              i.product._id === productId ? { ...i, count: newCount } : i
            );
            this.cartItems.set(updated);
            this.recalculateTotal();
          },
          error: () => this.loadingItemId.set(null),
        });
      }
    } else {
      this.updateLocalQuantity(productId, change);
    }
  }

  removeItem(productId: string): void {
    if (this.isLoggedIn()) {
      this.loadingItemId.set(productId);
      this.cartService.updatequantity({ count: 0 }, productId).subscribe({
        next: () => {
          this.loadingItemId.set(null);
          this.cartItems.set(this.cartItems().filter(i => i.product._id !== productId));
          this.recalculateTotal();
        },
        error: () => this.loadingItemId.set(null),
      });
    } else {
      this.removeLocalItem(productId);
    }
  }

  private updateLocalQuantity(productId: string, change: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const cartStr = localStorage.getItem('cart');
    if (!cartStr) return;
    const cart: LocalCartItem[] = JSON.parse(cartStr);
    const index = cart.findIndex(i => i.productId === productId);
    if (index > -1) {
      cart[index].count += change;
      if (cart[index].count < 1) {
        cart.splice(index, 1);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      this.localCartItems.set(cart);
      this.totalPrice.set(cart.reduce((sum, item) => sum + item.price * item.count, 0));
    }
  }

  private removeLocalItem(productId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const cartStr = localStorage.getItem('cart');
    if (!cartStr) return;
    const cart: LocalCartItem[] = JSON.parse(cartStr);
    const updated = cart.filter(i => i.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(updated));
    this.localCartItems.set(updated);
    this.totalPrice.set(updated.reduce((sum, item) => sum + item.price * item.count, 0));
  }

  private recalculateTotal(): void {
    const total = this.cartItems().reduce((sum, item) => sum + item.price * item.count, 0);
    this.totalPrice.set(total);
  }

  clearAll(): void {
    if (this.isLoggedIn()) {
      this.cartService.clearusercart().subscribe({
        next: () => {
          this.cartItems.set([]);
          this.totalPrice.set(0);
          this.cartCount = computed<number>(()=>0); 
        },
        error: () => {},
      });
    } else {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('cart');
        this.localCartItems.set([]);
        this.totalPrice.set(0);
      }
    }
  }
}