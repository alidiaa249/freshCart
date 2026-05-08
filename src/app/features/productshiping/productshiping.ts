import { Component, input } from '@angular/core';
import { productdetails } from '../../core/models/productdetails';

@Component({
  selector: 'app-productshiping',
  imports: [],
  templateUrl: './productshiping.html',
  styleUrl: './productshiping.css',
})
export class Productshiping {
  readonly product = input<productdetails | null>(null);
}
