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
  success_submit: boolean = true;

  submit_form() {
    this.success_submit = true;
    // this.button_loading = true;
    // setTimeout(() => {
    //   this.button_loading = false;
    // }, 2000);
  }
}
