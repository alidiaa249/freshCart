import { Component, input } from '@angular/core';
import { productdetails } from '../../core/models/productdetails';
import { StarsPipe } from '../../shared/stars-pipe';

@Component({
  selector: 'app-productreview',
  imports: [StarsPipe],
  templateUrl: './productreview.html',
  styleUrl: './productreview.css',
})
export class Productreview {
  readonly product = input<productdetails | null>(null);
}
