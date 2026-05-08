import { Categories } from './../../../core/services/categories';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorydetails',
  imports: [CommonModule, RouterLink],
  templateUrl: './categorydetails.html',
  styleUrl: './categorydetails.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categorydetails {
  private readonly route = inject(ActivatedRoute);
  private readonly categoriesService = inject(Categories);

  readonly categoryId = signal<string>('');
  readonly subcategories = signal<any[]>([]);
  readonly category = signal<any>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.categoryId.set(id);
      if (id) {
        this.loadCategory(id);
        this.loadSubcategories(id);
        console.log(this.subcategories());
        
      }
    });
  }

  private loadCategory(id: string) {
    this.categoriesService.getspeccategory(id).subscribe({
      next: (response) => this.category.set(response.data)
      
    });
  }

  private loadSubcategories(id: string) {
    this.categoriesService.getspecsubcategoryoncategory(id).subscribe({
      next: (response) => this.subcategories.set(response.data || [])
    });
  }
}
