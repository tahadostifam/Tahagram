import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[LazyImageLoading]',
})
export class LazyImageLoadingDirective {
  constructor(private elm: ElementRef) {
    console.log(this.elm);

    this.elm.nativeElement.onload = () => {
      this.elm.nativeElement.classList.add('__loaded__');
    };
  }
}
