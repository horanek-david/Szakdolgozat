import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { AppService } from '../services/app.service';

import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { 
  helper = new JwtHelperService();

  user = new User();
  username!: string;
  found = false;
  color = '#c0c0c0';
  isVisible:boolean = false;

  constructor(
    private appService: AppService,
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

  onSubmit(){
    var username = (document.getElementById('input-username') as HTMLInputElement).value;
    var password = (document.getElementById('input-password') as HTMLInputElement).value;

    this.user.name = username;
    this.user.password = password;

    this.appService.getUser(this.user).subscribe((data) => {
      
      if(data === null){
        this.found = true;
      }else{
        this.found = false;
        this.user = data;
        const token = Object.values(data);
        const decodedToken = this.helper.decodeToken(String(token));
        this.user._id = decodedToken._id;
        this.user.name = decodedToken.name;
        //this.appService.setLoggedInUser(this.user);
        localStorage.setItem('token', String(token));
        this.router.navigate(['/webshop']);
      }

      if (this.found) {
        this.color = 'red';
        this.isVisible = !this.isVisible;
      }
    });
  }
  
}
