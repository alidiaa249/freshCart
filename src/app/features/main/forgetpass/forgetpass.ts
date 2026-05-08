import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/services/user';
import { ToastService } from '../../../shared/services/toast';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgetpass',
  imports: [ReactiveFormsModule],
  templateUrl: './forgetpass.html',
  styleUrl: './forgetpass.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Forgetpass {
  private readonly _userServ = inject(User);
  private readonly _toast = inject(ToastService);
  private readonly _router = inject(Router);

  readonly step = signal(1);
  isloading = signal(false);
  email = signal('');

  forgotForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  verifyForm: FormGroup = new FormGroup({
    resetCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
  });

  resetForm: FormGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  sendCode(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    this.isloading.set(true);
    const emailValue = this.forgotForm.value.email;
    this._userServ.forgetpass({ email: emailValue }).subscribe({
      next: (res) => {
        this.isloading.set(false);
        this.email.set(emailValue);
        this.step.set(2);
        this._toast.show(res.message || 'Code sent successfully', 'success');
      },
      error: (err: HttpErrorResponse) => {
        this.isloading.set(false);
        this._toast.show(err.error?.message || 'Failed to send code', 'error');
      },
    });
  }

  verifyCode(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }
    this.isloading.set(true);
    this._userServ.verifycode({ resetCode: this.verifyForm.value.resetCode }).subscribe({
      next: (res) => {
        this.isloading.set(false);
        this.step.set(3);
        this._toast.show(res.message || 'Code verified successfully', 'success');
      },
      error: (err: HttpErrorResponse) => {
        this.isloading.set(false);
        this._toast.show(err.error?.message || 'Invalid code', 'error');
      },
    });
  }

  resetPassword(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    const newPassword = this.resetForm.value.newPassword;
    const confirmPassword = this.resetForm.value.confirmPassword;
    if (newPassword !== confirmPassword) {
      this._toast.show('Passwords do not match', 'error');
      return;
    }
    this.isloading.set(true);
    this._userServ.resetpass({ email:this.email(), newPassword:newPassword }).subscribe({
      next: (res) => {
        this.isloading.set(false);
        this._toast.show(res.message || 'Password reset successfully', 'success');
        setTimeout(() => this._router.navigate(['/signin']), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.isloading.set(false);
        this._toast.show(err.error?.message || 'Failed to reset password', 'error');
      },
    });
  }
}