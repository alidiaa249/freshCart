
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './features/navbar/navbar.component';
import { HomeComponent } from './features/home/home.component';
import { Category } from "./features/category/category";
import { Featureproducts } from "./features/featureproducts/featureproducts";
import { Footer } from './features/footer/footer';
import { ToastComponent } from './shared/components/toast/toast';

import { Homepage } from "./features/main/homepage/homepage";

@Component({
   selector: 'app-root',
  imports: [NavbarComponent,  RouterOutlet , Footer, Homepage, ToastComponent]
 ,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecommerce');
}
