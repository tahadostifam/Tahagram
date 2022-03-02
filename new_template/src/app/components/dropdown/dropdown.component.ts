import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent implements OnInit {
  @Input('id') id!: string;
  @Input('width') width!: string;
  @Input('offset') offset!: string;
  @Input('rtl') rtl!: boolean;
  @Input('large_items') large_items!: boolean;

  constructor(private elref: ElementRef) {}

  ngOnInit(): void {}

  closeDropDown(_id: string) {
    const el: HTMLElement = this.elref.nativeElement.querySelector(
      `#${_id} .dropdown .dropdown-content`
    );
    el.classList.remove('show');
    setTimeout(() => {
      el.style.display = 'none';
    }, 200);
  }

  showDropDown(_id: string) {
    const el: HTMLElement = this.elref.nativeElement.querySelector(
      `#${_id} .dropdown .dropdown-content`
    );
    el.style.display = 'block';
    setTimeout(() => {
      el.classList.add('show');
    }, 2);
  }
}
