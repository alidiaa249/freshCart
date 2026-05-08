import { Component, input, signal } from '@angular/core';
import { Productdetailsabout } from '../productdetailsabout/productdetailsabout';
import { Productreview } from '../productreview/productreview';
import { Productshiping } from '../productshiping/productshiping';
import { productdetails } from '../../core/models/productdetails';

@Component({
  selector: 'app-productdetailstabs',
  imports: [Productdetailsabout, Productreview, Productshiping],
  templateUrl: './productdetailstabs.html',
  styleUrl: './productdetailstabs.css',
})
export class Productdetailstabs {
  readonly product = input<productdetails | null>(null);
  readonly activeTab = signal<'about' | 'reviews' | 'shipping'>('about');

  setActiveTab(tab: 'about' | 'reviews' | 'shipping'): void {
    this.activeTab.set(tab);
  }
}