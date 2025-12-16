import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeTransform'
})

export class TimeTransformPipe implements PipeTransform {

  transform(value?: number, format: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }, locale: string = 'default'): string {
    if (!value) {
      return '';
    }

    const date = new Date(value * 1000);
    return date.toLocaleTimeString(locale, format);
  }

}
