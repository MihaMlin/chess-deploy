import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterDto} from "../interfaces/RegisterDto";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private url: string = 'http://localhost:5000';
  private opts: any = {withCredentials: true};

  constructor(private http: HttpClient) { }

  public registerUser = (info: RegisterDto) => {
    this.http.post(this.url + '/users', info, this.opts).subscribe();
  }
}
