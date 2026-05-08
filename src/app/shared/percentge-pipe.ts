import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentge'
})
export class PercentgePipe implements PipeTransform {

  transform(total: number, current: number): number {
    return Math.floor(((total - current) / total) * 100);
  }

}
