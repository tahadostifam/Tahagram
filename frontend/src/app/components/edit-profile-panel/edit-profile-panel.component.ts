import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'edit-profile-panel',
  templateUrl: './edit-profile-panel.component.html',
  styleUrls: ['./edit-profile-panel.component.less'],
})
export class EditProfilePanelComponent implements OnInit {
  @Input('show') show!: boolean;
  @Output() changeShow: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  closeButton() {
    this.changeShow.emit(false);
  }
}
