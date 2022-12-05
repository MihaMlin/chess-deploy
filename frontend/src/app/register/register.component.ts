import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterDto} from "../../interfaces/RegisterDto";
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public first_name: string = '';
  public last_name: string = '';
  public username: string = '';
  public password: string = '';
  public repeatPassword: string = '';
  public email: string = '';

  constructor(private backend: BackendService) { }

  ngOnInit(): void {
  }

  public registerUser = () => {
    // TODO validate information
    const info: RegisterDto = {first_name: this.first_name, last_name: this.last_name, username: this.username,
      email: this.email, password: this.password};
    this.backend.registerUser(info);
  }
}
