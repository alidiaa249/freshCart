import { Component, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Products } from './../../../core/services/products';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { productdetails } from '../../../core/models/productdetails';
import { StarsPipe } from '../../../shared/stars-pipe';
import { PercentgePipe } from '../../../shared/percentge-pipe';
import { Productdetailstabs } from "../../productdetailstabs/productdetailstabs";
import { Similarproducts } from "../../similarproducts/similarproducts";
import { Wishlist } from '../../../core/services/wishlist';
import { Cart } from '../../../core/services/cart';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-productsdetails',
  imports: [CommonModule, RouterLink, StarsPipe, PercentgePipe, Productdetailstabs, Similarproducts],
  templateUrl: './productsdetails.html',
  styleUrl: './productsdetails.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Productsdetails {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(Products);
  private wishlist = inject(Wishlist);
  private readonly cartService = inject(Cart);
  private platformId = inject(PLATFORM_ID);

  readonly productId = signal<string>('');
  readonly product = signal<productdetails | null>(null);
  readonly selectedImageIndex = signal<number>(0);
  readonly wishlistVersion = signal(0);
  readonly quantity = signal(1);
  isBrowser = isPlatformBrowser(this.platformId);

  readonly price = computed(() => {
    const p = this.product();
    if (!p) return 0;
    return p.priceAfterDiscount ?? p.price;
  });

  readonly totalPrice = computed(() => this.price() * this.quantity());

  readonly selectedImage = computed(() => {
    const p = this.product();
    if (!p?.images?.length) return null;
    const idx = this.selectedImageIndex();
    return p.images[idx] ?? p.images[0];
  });

  readonly wishlistProductIds = computed(() => {
    this.wishlistVersion();
    if (!this.isBrowser) return new Set<string>();
    const localItems = this.wishlist.getLocalWishlist();
    return new Set(localItems.map(item => item.productId));
  });

  readonly isInWishlist = computed(() => {
    const p = this.product();
    if (!p) return false;
    return this.wishlistProductIds().has(p._id);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.productId.set(id);
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  private loadProduct(id: string) {
    this.productsService.getspecproduct(id).subscribe({
      next: (response) => {
        this.product.set(response.data);
        this.selectedImageIndex.set(0);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  toggleWishlist(): void {
    if (!this.isBrowser) return;
    const p = this.product();
    if (!p) return;

    if (this.isInWishlist()) {
      this.removeFromWishlist(p);
    } else {
      this.addToWishlist(p);
    }
  }

  private addToWishlist(product: any): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.wishlist.addToWishlistAndSync(product._id).subscribe({
        next: () => {
          this.wishlistVersion.update(v => v + 1);
          console.log('added to wishlist');
        },
        error: (err) => console.error('Error adding to wishlist', err),
      });
    } else {
      this.wishlist.addLocalWishlist(product);
      this.wishlistVersion.update(v => v + 1);
    }
  }

  private removeFromWishlist(product: any): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.wishlist.removeFromWishlistAndSync(product._id).subscribe({
        next: () => {
          this.wishlistVersion.update(v => v + 1);
          console.log('removed from wishlist');
        },
        error: (err) => console.error('Error removing from wishlist', err),
      });
    } else {
      this.wishlist.removeLocalWishlist(product._id);
      this.wishlistVersion.update(v => v + 1);
    }
  }

  increaseQuantity(): void {
    const p = this.product();
    if (!p) return;
    this.quantity.update(q => Math.min(q + 1, p.quantity));
  }

  decreaseQuantity(): void {
    this.quantity.update(q => Math.max(q - 1, 1));
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;

    const token = localStorage.getItem('token');
    if (token) {
      this.cartService.addToCart({ productId: p._id }).subscribe({
        next: () => {
          if (this.quantity() > 1) {
            this.cartService.updatequantity({ count: this.quantity() }, p._id).subscribe({
              next: () => {
                this.quantity.set(1);
                console.log('added to cart with quantity:', this.quantity());
              },
            });
          } else {
            this.quantity.set(1);
            console.log('added to cart');
          }
        },
        error: (err) => console.error('Error adding to cart', err),
      });
    } else {
      this.addToLocalCart(p);
      this.quantity.set(1);
    }
  }

  private addToLocalCart(product: productdetails): void {
    if (!this.isBrowser) return;
    const cartStr = localStorage.getItem('cart');
    const cart: any[] = cartStr ? JSON.parse(cartStr) : [];

    const existingItem = cart.find(item => item.productId === product._id);
    if (existingItem) {
      existingItem.count = Math.min(existingItem.count + this.quantity(), product.quantity);
    } else {
      cart.push({ productId: product._id, count: this.quantity() });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }
}