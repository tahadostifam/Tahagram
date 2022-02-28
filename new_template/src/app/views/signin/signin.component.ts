import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.less'],
})
export class SigninComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  button_loading: boolean = false;
  success_submit: boolean = false;
  email: string = '';
  email_isnt_valid: boolean = false;

  submit_form() {
    this.success_submit = true;
    // this.email_isnt_valid = true;
    // this.button_loading = true;
    // setTimeout(() => {
    //   this.button_loading = false;
    // }, 2000);
  }

  back_to_submit_form() {
    this.success_submit = false;
  }
}
