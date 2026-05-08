import { Component, inject } from '@angular/core';
import { User } from '../../../core/services/user';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toast';
import { Cart } from '../../../core/services/cart';
import { Wishlist } from '../../../core/services/wishlist';
import { AuthService } from '../../../core/services/auth';
import { CartWishlistState } from '../../../core/services/cart-wishlist-state';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  private readonly _authserv = inject(User);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);
  private readonly _cart = inject(Cart);
  private readonly _wishlist = inject(Wishlist);
  private readonly _auth = inject(AuthService);
  private readonly _state = inject(CartWishlistState);

  showpass: boolean = false;
  registersub: Subscription = new Subscription();
  isloading: boolean = false;
  apierrormessage: string = '';
  apisuccessmessage: string = ' ';

  loginform: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'),
    ]),
  });

  login() {
    if (this.loginform.valid) {
      this.isloading = true;
      this.registersub.unsubscribe();

      this.apierrormessage = '';
      this.registersub = this._authserv.signin(this.loginform.value).subscribe({
        next: (res) => {
          console.log(res);
          this.apisuccessmessage = res.message;
          this._auth.login(res.token, res.user);
          this.isloading = false;
          this._toast.show('Login successful', 'success');

          const syncCart$ = this._cart.syncLocalCartToBackend();
          const syncWishlist$ = this._wishlist.syncLocalWishlistToBackend();
          forkJoin([syncCart$, syncWishlist$]).subscribe({
            next: () => {
              console.log('Local cart and wishlist synced');
              this._state.refreshCartCount();
              this._state.refreshWishlistCount();
            },
            error: (err) => console.error('Sync error', err),
            complete: () => this._router.navigate(['/Home']),
          });
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.apierrormessage = err.error.message;
          this.isloading = false;
          this._toast.show(err.error.message || 'Login failed', 'error');
        },
        complete: () => {
          this.isloading = false;
          this.loginform.reset();
        },
      });
    } else {
      this.loginform.markAllAsTouched();
    }
  }
}