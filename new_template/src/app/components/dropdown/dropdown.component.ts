import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent implements OnInit {
  @Input('id') id!: string;
  @Input('width') width!: string;
  @Input('offset_top') offset_top?: string;
  @Input('offset_bottom') offset_bottom?: string;
  @Input('rtl') rtl!: boolean;
  @Input('bottom') bottom?: boolean;
  @Input('large_items') large_items!: boolean;

  constructor(private elref: ElementRef) {}

  ngOnInit(): void {}

  remove_anim: any = null;

  closeDropDown(_id: string) {
    const el: HTMLElement = this.elref.nativeElement.querySelector(
      `#${_id} .dropdown .dropdown-content`
    );
    clearTimeout(this.remove_anim);
    el.classList.remove('show');
    this.remove_anim = setTimeout(() => {
      el.style.display = 'none';
    }, 150);
  }

  showDropDown(_id: string) {
    const el: HTMLElement = this.elref.nativeElement.querySelector(
      `#${_id} .dropdown .dropdown-content`
    );
    el.style.display = 'block';
    setTimeout(() => {
      el.classList.add('show');
    }, 1);
  }
}
