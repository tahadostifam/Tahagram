import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[LazyImageLoading]',
})
export class LazyImageLoadingDirective {
  constructor(private elm: ElementRef) {
    setTimeout(() => {
      const img = this.elm.nativeElement.querySelector('img');
      if (img) {
        img.onload = () => {
          this.elm.nativeElement.classList.add('image__loaded');
        };
      }
    }, 5);
  }
}
