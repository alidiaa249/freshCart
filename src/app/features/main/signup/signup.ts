import { Component, inject, computed, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/services/user';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly _authserv = inject(User);


  apierrormessage = '';
  apisuccessmessage = '';
  isloading = false;
  registersub = new Subscription();
  private readonly _router = inject(Router);
  passwordValue = signal('');

  registerform: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        ),
      ]),
      rePassword: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        ),
      ]),
    },
    { validators: [this.confirmpassword.bind(this)] }
  );

  passwordStrength = computed(() => {
    const password = this.passwordValue();
    if (!password) return { strength: 0, label: 'Weak', color: 'bg-red-500' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[#?!@$%^&*-]/.test(password)) score++;

    const strength = score * 20;
    if (score <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { strength, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  });

  get name() {
    return this.registerform.get('name')!;
  }

  get email() {
    return this.registerform.get('email')!;
  }

  get phone() {
    return this.registerform.get('phone')!;
  }

  get password() {
    return this.registerform.get('password')!;
  }

  get rePassword() {
    return this.registerform.get('rePassword')!;
  }

  onPasswordInput() {
    this.passwordValue.set(this.registerform.get('password')?.value || '');
  }



  register() {
    if (this.registerform.valid) {
      this.isloading = true;
      this.registersub.unsubscribe();

      this.apierrormessage = '';
      this.registersub = this._authserv.signup(this.registerform.value).subscribe({
        next: (res) => {
          this.apisuccessmessage = res.message;
          this.isloading = false;
          this._router.navigate(['/signin']);
        },
        error: (err: HttpErrorResponse) => {
          this.apierrormessage = err.error.message;
          this.isloading = false;
        },
        complete: () => {
          this.isloading = false;
          this.registerform.reset();
        },
      });
    } else {
      this.registerform.markAllAsTouched();
    }
  }

  confirmpassword(formgroup: AbstractControl) {
    const password = formgroup.get('password')?.value;
    const rePassword = formgroup.get('rePassword')?.value;
    if (password !== rePassword && rePassword !== '') {
      formgroup.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }
}