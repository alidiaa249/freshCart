import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, from, concatMap, tap, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { wishlistCount } from './cart-wishlist-signals';

interface LocalWishlistItem {
  productId: string;
  product?: {
    _id?: string;
    [key: string]: any;
  };
  addedAt?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class Wishlist {
  private readonly _http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  addToWishlist(productId: string): Observable<any> {
    return this._http.post(
      environment.baseurl + '/api/v1/wishlist',
      { productId },
      {
        headers: {
          token: localStorage.getItem('token') || '',
        },
      },
    ).pipe(tap(() => wishlistCount.update(v => v + 1)));
  }

  getWishlist(): Observable<any> {
    return this._http.get(environment.baseurl + '/api/v1/wishlist', {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    });
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this._http.delete(environment.baseurl + `/api/v1/wishlist/${productId}`, {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    }).pipe(tap(() => wishlistCount.update(v => Math.max(0, v - 1))));
  }

  addLocalWishlist(product: any): void {
    const wishlistStr = localStorage.getItem('wishlist');
    const wishlist: any[] = wishlistStr ? JSON.parse(wishlistStr) : [];

    const exists = wishlist.some((item) => item.productId === product._id);
    if (exists) return;

    wishlist.push({
      productId: product._id,
      product: {
        _id: product._id,
        id: product.id,
        title: product.title,
        imageCover: product.imageCover,
        price: product.price,
        category: {
          name: product.category?.name ?? '',
        },
      },
      addedAt: Date.now(),
    });

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    wishlistCount.update(v => v + 1);
  }

  removeLocalWishlist(productId: string): void {
    const wishlistStr = localStorage.getItem('wishlist');
    if (!wishlistStr) return;
    const wishlist: any[] = JSON.parse(wishlistStr);
    const updated = wishlist.filter((item) => item.productId !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    wishlistCount.update(v => Math.max(0, v - 1));
  }

  getLocalWishlist(): LocalWishlistItem[] {
    if (this.isBrowser) {
      const wishlistStr = localStorage.getItem('wishlist');
      return wishlistStr ? JSON.parse(wishlistStr) : [];
    }
    return [];
  }

  isInLocalWishlist(productId: string): boolean {
    const wishlist = this.getLocalWishlist();
    return wishlist?.some(
      (item) => item.productId === productId || item.product?._id === productId,
    );
  }

  syncLocalWishlistToBackend(): Observable<any> {
    const wishlistStr = localStorage.getItem('wishlist');
    if (!wishlistStr) return from([null]);

    const wishlist: any[] = JSON.parse(wishlistStr);
    if (wishlist.length === 0) return from([null]);

    return from(wishlist).pipe(
      concatMap((item) => this.addToWishlist(item.productId)),
      tap({ complete: () => {
        localStorage.removeItem('wishlist');
        wishlistCount.set(0);
      }}),
    );
  }

  addToWishlistAndSync(productId: string): Observable<any> {
    return this.addToWishlist(productId).pipe(
      switchMap(() => this.getWishlist()),
      tap((res: any) => {
        const items = res.data?.products || res.data || [];
        const normalized = items.map((item: any) => ({
          productId: item.productId || item.product?._id || item._id,
          product: item.product || item,
        }));
        localStorage.setItem('wishlist', JSON.stringify(normalized));
        wishlistCount.set(items.length);
      }),
    );
  }

  removeFromWishlistAndSync(productId: string): Observable<any> {
    return this.removeFromWishlist(productId).pipe(
      switchMap(() => this.getWishlist()),
      tap((res: any) => {
        const items = res.data?.products || res.data || [];
        const normalized = items.map((item: any) => ({
          productId: item.productId || item.product?._id || item._id,
          product: item.product || item,
        }));
        localStorage.setItem('wishlist', JSON.stringify(normalized));
        wishlistCount.set(items.length);
      }),
    );
  }

  refreshLocalFromApi(): Observable<any> {
    return this.getWishlist().pipe(
      tap((res: any) => {
        const items = res.data?.products || res.data || [];
        const normalized = items.map((item: any) => ({
          productId: item.productId || item.product?._id || item._id,
          product: item.product || item,
        }));
        localStorage.setItem('wishlist', JSON.stringify(normalized));
        wishlistCount.set(items.length);
      }),
    );
  }
}