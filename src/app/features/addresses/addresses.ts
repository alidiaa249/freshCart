import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../core/services/user';
import { Address } from '../../core/models/address';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-addresses',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addresses.html',
  styleUrl: './addresses.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Addresses {
  private readonly userService = inject(User);
  private readonly fb = inject(FormBuilder);

  readonly addresses = signal<Address[]>([]);
  readonly showModal = signal(false);
  readonly isEditing = signal(false);
  readonly editingAddressId = signal<string | null>(null);

  readonly addressForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    details: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^01[0-9]{9}$/)]],
    city: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadAddresses();
  }

  private loadAddresses(): void {
    this.userService.getuseraddress().subscribe({
      next: (res: any) => {
        this.addresses.set(res.data || []);
      },
      error: (err) => console.error('Error loading addresses', err),
    });
  }

  openAddModal(): void {
    this.isEditing.set(false);
    this.editingAddressId.set(null);
    this.addressForm.reset();
    this.showModal.set(true);
  }

  openEditModal(address: Address): void {
    this.isEditing.set(true);
    this.editingAddressId.set(address._id);
    this.addressForm.patchValue({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city,
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingAddressId.set(null);
    this.addressForm.reset();
  }

  submitAddress(): void {
    if (this.addressForm.invalid) return;

    const formValue = this.addressForm.value;

    if (this.isEditing()) {
      const oldId = this.editingAddressId();
      if (!oldId) return;

      this.userService.deleteaddreses(oldId).subscribe({
        next: () => {
          this.userService.addAddress(formValue).subscribe({
            next: () => {
              this.closeModal();
              this.loadAddresses();
            },
            error: (err) => console.error('Error adding updated address', err),
          });
        },
        error: (err) => console.error('Error deleting old address', err),
      });
    } else {
      this.userService.addAddress(formValue).subscribe({
        next: () => {
          this.closeModal();
          this.loadAddresses();
        },
        error: (err) => console.error('Error adding address', err),
      });
    }
  }

  deleteAddress(id: string): void {
    this.userService.deleteaddreses(id).subscribe({
      next: () => this.loadAddresses(),
      error: (err) => console.error('Error deleting address', err),
    });
  }
}