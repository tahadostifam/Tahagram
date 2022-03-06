import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.less'],
})
export class SettingsPanelComponent implements OnInit {
  @Input('show') show!: boolean;
  @Output() changeShow: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  closeButton(new_state: boolean) {
    this.changeShow.emit(new_state);
  }

  ngOnInit(): void {}
}
