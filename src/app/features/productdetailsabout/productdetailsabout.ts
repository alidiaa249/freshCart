import { Component, input } from '@angular/core';
import { productdetails } from '../../core/models/productdetails';

@Component({
  selector: 'app-productdetailsabout',
  imports: [],
  templateUrl: './productdetailsabout.html',
  styleUrl: './productdetailsabout.css',
})
export class Productdetailsabout {
  readonly product = input<productdetails | null>(null);
}
