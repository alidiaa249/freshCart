import { Component, inject, OnInit, signal } from '@angular/core';
import { Categories } from '../../../core/services/categories';
import { Category } from '../../../core/models/products';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-categorypage',
  imports: [RouterLink],
  templateUrl: './categorypage.html',
  styleUrl: './categorypage.css',
})
export class Categorypage implements OnInit {
  private readonly category = inject(Categories);
  allcategory = signal<Category[]>([]);
  ngOnInit(): void {
    this.getallcategory();
  }
  getallcategory() {
    this.category.getallcategory().subscribe({
      next: (value) => {
        console.log(value);
        this.allcategory.set(value.data);
      },
    });
  }
}
