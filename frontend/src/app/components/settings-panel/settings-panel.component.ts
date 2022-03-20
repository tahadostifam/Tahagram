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

  show_notifications_panel: boolean = false;
  show_edit_profile_panel: boolean = true;

  changeShowNotifications(new_state: boolean) {
    this.show_notifications_panel = new_state;
  }

  changeShowEditProfile(new_state: boolean) {
    this.show_notifications_panel = new_state;
  }

  closeButton() {
    this.changeShow.emit(false);
  }

  ngOnInit(): void {}
}
