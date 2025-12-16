import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixed'
})

export class NumToFixedPipe implements PipeTransform {

  transform(value: number | null | undefined, digits: number = 2): unknown {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00'; 
    }
    
    return value.toFixed(digits);
  } 
  
}
