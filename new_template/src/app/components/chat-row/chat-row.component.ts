import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'chat-row',
  templateUrl: './chat-row.component.html',
  styleUrls: ['./chat-row.component.less'],
})
export class ChatRowComponent implements OnInit {
  @Input('active') active?: boolean;
  @Input('title') title!: string;
  @Input('last_message') last_message!: string;
  @Input('last_message_date') last_message_date!: string;
  @Input('unread_messages') unread_messages?: string;
  @Input('avatar') avatar?: string;

  constructor() {}

  ngOnInit(): void {}
}
