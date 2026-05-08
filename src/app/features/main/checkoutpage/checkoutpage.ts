import { Cart } from '../../../core/services/cart';
import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast';

@Component({
  selector: 'app-checkoutpage',
  imports: [CurrencyPipe, RouterLink, FormsModule],
  templateUrl: './checkoutpage.html',
  styleUrl: './checkoutpage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkoutpage implements OnInit {
  private cartService = inject(Cart);
  private platformId = inject(PLATFORM_ID);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);

  isLoggedIn = signal(false);
  cartItems = signal<any[]>([]);
  localCartItems = signal<any[]>([]);
  totalPrice = signal(0);
  cartId = signal('');

  addresses = signal<any[]>([]);
  selectedAddressIndex = signal(-1);

  paymentMethod = signal<'cash' | 'online'>('cash');

  shippingCity = signal('');
  shippingDetails = signal('');
  shippingPhone = signal('');
  submitted = signal(false)

  cityError = computed(() => {
    const city = this.shippingCity();
    if (!city) return 'City is required';
    if (city.length < 2) return 'City must be at least 2 characters';
    return '';
  });

  detailsError = computed(() => {
    const details = this.shippingDetails();
    if (!details) return 'Address is required';
    if (details.length < 10) return 'Address must be at least 10 characters';
    return '';
  });

  phoneError = computed(() => {
    const phone = this.shippingPhone();
    if (!phone) return 'Phone is required';
    const egyptianPhoneRegex = /^(01)[0-9]{9}$/;
    if (!egyptianPhoneRegex.test(phone)) return 'Please enter a valid Egyptian number (01xxxxxxxxx)';
    return '';
  });

  isFormValid = computed(() => {
    return !this.cityError() && !this.detailsError() && !this.phoneError();
  });

  allItems = computed(() => {
    return this.isLoggedIn() ? this.cartItems() : this.localCartItems();
  });

  cartCount = computed(() => {
    return this.allItems().reduce((sum: number, item: any) => sum + item.count, 0);
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn.set(localStorage.getItem('token') !== null);
      this.loadCart();
      if (this.isLoggedIn()) {
        this.loadAddresses();
      }
    }
  }

  private loadCart(): void {
    if (this.isLoggedIn()) {
      this.cartService.getuserCart().subscribe({
        next: (res: any) => {
          this.cartItems.set(res.data.products);
          this.totalPrice.set(res.data.totalCartPrice);
          this.cartId.set(res.data._id);
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
      const cart: any[] = JSON.parse(cartStr);
      this.localCartItems.set(cart);
      const total = cart.reduce((sum, item) => sum + item.price * item.count, 0);
      this.totalPrice.set(total);
    }
  }

  private loadAddresses(): void {
    this.cartService.getuseraddress().subscribe({
      next: (res: any) => {
        this.addresses.set(res.data || []);
      },
    });
  }

  selectAddress(index: number): void {
    this.selectedAddressIndex.set(index);
    const addr = this.addresses()[index];
    if (addr) {
      this.shippingCity.set(addr.city || '');
      this.shippingDetails.set(addr.details || '');
      this.shippingPhone.set(addr.phone || '');
    }
  }

  clearAddress(): void {
    this.selectedAddressIndex.set(-1);
    this.shippingCity.set('');
    this.shippingDetails.set('');
    this.shippingPhone.set('');
  }

  selectPayment(method: 'cash' | 'online'): void {
    this.paymentMethod.set(method);
  }

  placeOrder(): void {
    this.submitted.set(true)
    if (!this.isFormValid()) {
      this._toast.show('Please fix the errors in the form', 'error');
      return;
    }

    const data = {
      shippingAddress: {
        city: this.shippingCity(),
        details: this.shippingDetails(),
        phone: this.shippingPhone(),
      },
    };

    if (this.paymentMethod() === 'cash') {
      this.cartService.createCashOrder(data, this.cartId()).subscribe({
        next: (res: any) => {
          this._toast.show('Order placed successfully!', 'success');
          this._router.navigate(['/Home']);
        },
        error: (err) => {
          this._toast.show('Failed to place order. Please try again.', 'error');
        },
      });
    } else {
      this.cartService.payonline(data, this.cartId()).subscribe({
        next: (res: any) => {
          if (isPlatformBrowser(this.platformId) && res?.session?.url) {
            window.location.href = res.session.url;
          }
        },
        error: (err) => {
          this._toast.show('Failed to process payment. Please try again.', 'error');
        },
      });
    }
  }

  getItemPrice(item: any): number {
    return item.price * item.count;
  }

  getProduct(item: any): any {
    return item.product || item;
  }
}