import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Products } from '../../../core/services/products';
import { Categories } from '../../../core/services/categories';
import { Featureproducts } from '../../featureproducts/featureproducts';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Productsinterface } from '../../../core/models/products';

@Component({
  selector: 'app-productspage',
  imports: [Featureproducts, CommonModule, RouterLink],
  templateUrl: './productspage.html',
  styleUrl: './productspage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Productspage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(Products);
  private readonly categoriesService = inject(Categories);

  readonly subcategoryId = signal<string>('');
  readonly brandId = signal<string>('');
  readonly products = signal<Productsinterface[]>([]);
  readonly subcategoryName = signal<string>('');
  readonly brandName = signal<string>('');

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const subId = params.get('subcategory') || '';
      const brandId = params.get('brand') || '';
      const category = params.get('category') || '';

      this.subcategoryId.set(subId);
      this.brandId.set(brandId);

      if (subId) {
        this.loadSubcategory(category);
        this.loadProductsByCategory(subId);
      } else if (brandId) {
        this.subcategoryName.set('');
        this.brandName.set('');
        this.loadProductsByBrand(brandId);
      } else {
        this.subcategoryName.set('');
        this.brandName.set('');
        this.loadAllProducts();
      }
    });
  }

  private loadSubcategory(id: string) {
    this.categoriesService.getspecsubcategory(id).subscribe({
      next: (response) => this.subcategoryName.set(response.data?.name || ''),
    });
  }

  private loadProductsByCategory(id: string) {
    this.productsService.getProductsByCategory(id).subscribe({
      next: (response) => this.products.set(response.data || []),
    });
  }

  private loadProductsByBrand(id: string) {
    this.productsService.getProductsByBrand(id).subscribe({
      next: (response) => this.products.set(response.data || []),
    });
    this.productsService.getBrandById(id).subscribe({
      next: (response) => this.brandName.set(response.data?.name || ''),
    });
  }

  private loadAllProducts() {
    this.productsService.getallproducts().subscribe({
      next: (response) => this.products.set(response.data || []),
    });
  }
}
