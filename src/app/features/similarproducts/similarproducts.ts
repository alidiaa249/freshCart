import { Component, input, signal, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Products } from '../../core/services/products';
import { Productsinterface } from '../../core/models/products';
import { ChangeDetectionStrategy } from '@angular/core';

import { PercentgePipe } from '../../shared/percentge-pipe';
import { StarsPipe } from '../../shared/stars-pipe';
import { RouterLink } from "@angular/router";
import { Featureproducts } from '../featureproducts/featureproducts';

@Component({
  selector: 'app-similarproducts',
  imports: [PercentgePipe, StarsPipe, RouterLink, Featureproducts],
  templateUrl: './similarproducts.html',
  styleUrl: './similarproducts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Similarproducts implements OnInit {
  readonly categoryId = input<string>('');
  private readonly productsService = inject(Products);

  readonly products = signal<Productsinterface[]>([]);
  readonly loading = signal<boolean>(false);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    const id = this.categoryId();
    if (id) {
      this.loading.set(true);
      this.productsService.getProductsByCategory(id).subscribe({
        next: (response) => {
          const items = response.data || [];
          this.products.set(items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  scroll(direction: 'left' | 'right'): void {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    const scrollAmount = 300;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }
}