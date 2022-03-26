import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.less'],
})
export class NotificationsPanelComponent implements OnInit {
  @Input('show') show!: boolean;
  @Output() changeShow: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  closeButton() {
    this.changeShow.emit(false);
  }
}
