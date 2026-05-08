import { Toast, ToastService } from './../../shared/services/toast';
import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  private readonly userService = inject(User);
  private readonly _toast = inject(ToastService);
  readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  readonly isBrowser = typeof window !== 'undefined';

  readonly userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
  });

  readonly passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rePassword: ['', Validators.required],
  });

  readonly userUpdateSuccess = signal(false);
  readonly passUpdateSuccess = signal(false);

  ngOnInit(): void {
    this.userService.verifytoken().subscribe({
      next: (res: any) => {
        if (res.decoded) {
          this.authService.user.set(res.decoded);
          
          if (this.isBrowser) {
            localStorage.setItem('user', JSON.stringify(res.decoded));
          }
        }
        const u = this.authService.user();
        if (u) {
          this.userForm.patchValue({
            name: u['name'] || '',
            email: u['email'] || '',
            phone: u['phone'] || '',
          });
        }
      },
      error: (err) => {
        console.error('Error verifying token', err);
        const u = this.authService.user();
        if (u) {
          this.userForm.patchValue({
            name: u['name'] || '',
            email: u['email'] || '',
            phone: u['phone'] || '',
          });
        }
      },
    });
  }

  submitUserUpdate(): void {
    if (this.userForm.invalid) return;
    this.userUpdateSuccess.set(false);

    this.userService.updateuserdata(this.userForm.value).subscribe({
      next: (res: any) => {
        this.userUpdateSuccess.set(true);
        if (res.data) {
          this.authService.user.set(res.data);
          if (this.isBrowser) {
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        }
      },
      error: (err) => {
        console.error('Error updating user data', err);
        this._toast.show(err.error.errors.msg || `Failed to update user data`, 'error');
        this.userUpdateSuccess.set(false);
      },
    });
  }

  submitPasswordUpdate(): void {
    if (this.passwordForm.invalid) return;

    const { rePassword, ...data } = this.passwordForm.value;
    if (data.password !== rePassword) {
      console.error('Passwords do not match');
      return;
    }

    this.passUpdateSuccess.set(false);

    this.userService.updatepass(data).subscribe({
      next: () => {
        this.passUpdateSuccess.set(true);
        this.passwordForm.reset();
      },
      error: (err) => {
        console.error('Error updating password', err);
        this.passUpdateSuccess.set(false);
      },
    });
  }
}