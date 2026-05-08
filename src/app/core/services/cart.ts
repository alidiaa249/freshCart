import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, from, concatMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { cartCount } from './cart-wishlist-signals';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private readonly _http = inject(HttpClient);

  addToCart(data: any): Observable<any> {
    return this._http.post(environment.baseurl + '/api/v2/cart', data, {
      headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('token')}`,
        token: localStorage.getItem('token') || '',
      },
    }).pipe(tap(() => cartCount.update(v => v + 1)));
  }

  getuserCart(): Observable<any> {
    return this._http.get(environment.baseurl + '/api/v2/cart', {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    });
  }

  updatequantity(data: any, productId: string): Observable<any> {
    return this._http.put(environment.baseurl + `/api/v2/cart/${productId}`, data, {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    });
  }

  deleteItem(productId: string): Observable<any> {
    return this._http.delete(environment.baseurl + `/api/v2/cart/${productId}`, {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    }).pipe(tap(() => cartCount.update(v => Math.max(0, v - 1))));
  }

  syncLocalCartToBackend(): Observable<any> {
    const cartStr = localStorage.getItem('cart');
    if (!cartStr) return from([null]);

    const cart: any[] = JSON.parse(cartStr);
    if (cart.length === 0) return from([null]);

    return from(cart).pipe(
      concatMap(item => {
        return this.addToCart({ productId: item.productId }).pipe(
          concatMap(() => {
            if (item.count > 1) {
              return this.updatequantity({ count: item.count }, item.productId);
            }
            return [null];
          }),
        );
      }),
      tap({ complete: () => {
        localStorage.removeItem('cart');
        cartCount.set(0);
      }}),
    );
  }

  getuseraddress(): Observable<any> {
    return this._http.get(environment.baseurl + '/api/v1/addresses', {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    });
  }

  addAddress(data: any): Observable<any> {
    return this._http.post(environment.baseurl + '/api/v1/addresses', data, {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    });
  }

  createCashOrder(data: any, cartid: string): Observable<any> {
    return this._http.post(environment.baseurl + `/api/v1/orders/${cartid}`, data, {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    });
  }

  payonline(data: any, cartid: string): Observable<any> {
    return this._http.post(
      environment.baseurl + `/api/v1/orders/checkout-session/${cartid}?url=http://localhost:4200`,
      data,
      {
        headers: {
          token: localStorage.getItem('token') || '',
        },
      },
    );
  }
    clearusercart(): Observable<any> {
    return this._http.delete(environment.baseurl + '/api/v2/cart', {
      headers: {
        token: localStorage.getItem('token') || '',
      },
    });
  }
}