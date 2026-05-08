import { Categoryinterface } from './../../core/models/category';

import { Categories } from './../../core/services/categories';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-category',
  imports: [RouterLink],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
private readonly Categories = inject(Categories);
allcategories= signal<Categoryinterface[]>([]);
ngOnInit(): void {
this.Categories.getallcategory().subscribe({
  next:(value)=> {
   
    this.allcategories.set(value.data);
    
  },
})
  
}

}
