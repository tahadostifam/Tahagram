import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less'],
})
export class ChatComponent implements OnInit {
  @ViewChild('showMenuButton') menu_button!: ElementRef;
  @ViewChild('searchChatsList') search_chats_list!: ElementRef;

  constructor(private elref: ElementRef) {}

  dropdown: DropdownComponent = new DropdownComponent(this.elref);

  ngOnInit(): void {}

  search_mode: boolean = false;
  show_search_chats_list: boolean = false;
  search_input: string = '';

  rotateIcon(el: ElementRef) {
    if (!el.nativeElement.classList.contains('rotate_icon')) {
      el.nativeElement.classList.add('rotate_icon');
      setTimeout(() => {
        el.nativeElement.classList.remove('rotate_icon');
      }, 300);
    }
  }

  setSearchChatsListState(state: boolean) {
    if (!state) {
      this.search_chats_list.nativeElement.classList.remove('show');
      setTimeout(() => {
        this.show_search_chats_list = false;
      }, 200);
    } else {
      this.show_search_chats_list = true;
      setTimeout(() => {
        this.search_chats_list.nativeElement.classList.add('show');
      }, 10);
    }
  }

  menuButtonClick() {
    if (this.search_mode == true) {
      this.search_mode = false;
      this.setSearchChatsListState(false);
      this.rotateIcon(this.menu_button);
      this.search_input = '';
      return;
    }
    this.dropdown.showDropDown('menu_dropdown');
  }

  searchInputFocus() {
    if (!this.search_mode && !this.show_search_chats_list) {
      this.search_mode = true;
      this.setSearchChatsListState(true);
      this.rotateIcon(this.menu_button);
    }
  }

  showChat() {}
}
