import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../register/register.component.scss']
})
export class LoginComponent implements OnInit {
  public username: string = "";
  public password: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  public loginUser = () => {

  }

}
