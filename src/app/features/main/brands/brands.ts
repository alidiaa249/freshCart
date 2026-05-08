import { Component, OnInit, signal, inject } from '@angular/core';
import { Products } from '../../../core/services/products';
import { Brand } from '../../../core/models/products';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands',
  imports: [RouterLink],
  templateUrl: './brands.html',
  styleUrl: './brands.css',
})
export class Brands implements OnInit {
  private readonly productsService = inject(Products);

  readonly brands = signal<Brand[]>([]);
  readonly loading = signal<boolean>(true);

  ngOnInit(): void {
    this.productsService.getAllBrands().subscribe({
      next: (response) => {
        const items = response.data || [];
        this.brands.set(items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}