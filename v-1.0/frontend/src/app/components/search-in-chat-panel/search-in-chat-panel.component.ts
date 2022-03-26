import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'search-in-chat-panel',
  templateUrl: './search-in-chat-panel.component.html',
  styleUrls: ['./search-in-chat-panel.component.less'],
})
export class SearchInChatPanelComponent implements OnInit {
  @Input('show') show!: boolean;
  @Output() changeShow: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  closeButton() {
    this.changeShow.emit(false);
  }
}
