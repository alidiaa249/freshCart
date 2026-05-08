import { Component, inject, OnInit, signal } from '@angular/core';
import { HomeComponent } from "../../home/home.component";
import { Category } from "../../category/category";
import { Featureproducts } from "../../featureproducts/featureproducts";
import { Productsinterface } from '../../../core/models/products';
import { Products } from '../../../core/services/products';

@Component({
  selector: 'app-homepage',
  imports: [HomeComponent, Category, Featureproducts],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit {
  private readonly productsserv = inject(Products);
  products= signal<Productsinterface[]>([]);
     ngOnInit(): void {
      this.productsserv.getallproducts().subscribe((res:any)=>{
     console.log(res);
     
        this.products.set(res.data);
      });
      
     }
}
