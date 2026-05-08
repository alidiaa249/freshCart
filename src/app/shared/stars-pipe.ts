import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stars'
})
export class StarsPipe implements PipeTransform {

 transform(
    rating: number,
    maxStars: number = 5
  ): ('full' | 'half' | 'empty')[] {

    const stars: ('full' | 'half' | 'empty')[] = [];

    for (let i = 1; i <= maxStars; i++) {

      if (rating >= i) {
        stars.push('full');
      }

      else if (rating >= i - 0.5) {
        stars.push('half');
      }

      else {
        stars.push('empty');
      }

    }

    return stars;
  }

}
