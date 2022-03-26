import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.less'],
})
export class MessageComponent implements OnInit {
  @Input('sender') sender?: string;
  @Input('send_time') send_time!: string;
  @Input('my_message') my_message: boolean = false;
  @Input('message_type') message_type?: string;
  @Input('seen_state') seen_state?: string = '';
  @Input('edited') edited?: boolean = false;
  // public option
  @Input('text_content') text_content?: string;
  // types of messages
  @Input('img_addr') img_addr?: string;
  @Input('file_addr') file_addr?: string;
  @Input('voice_addr') voice_addr?: string;

  constructor() {}

  ngOnInit(): void {}
}
