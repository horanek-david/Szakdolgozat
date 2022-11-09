import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { User } from '../model/user';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  user = new User();
  color = '#c0c0c0';
  isVisible:boolean = false;
  isTextVisible:boolean = false;

  userForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    email: new FormControl()
  });
;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private appService: AppService,
    private ngZone: NgZone
  ) {
    this.validatorForm();
  }

  ngOnInit(): void {
  }

  validatorForm() {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(9)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      email: ['', [Validators.email]]
    });
  }

  onSubmit(){
    var username = (document.getElementById('username') as HTMLInputElement).value;
    var password = (document.getElementById('password') as HTMLInputElement).value;
    var email = (document.getElementById('email') as HTMLInputElement).value;

    this.user.name = username;
    this.user.password = password;
    this.user.email = email;

    if(this.userForm.valid){
      this.color = "c0c0c0";
      this.isVisible = false;
    }else if(!this.userForm.valid){
      this.color = "red";
      this.isVisible = true;
      return;
    }

    this.appService.createUser(this.user).subscribe(data => {
      var msg = data;

      if(!msg){
        this.router.navigate(['login']);
      }else if(msg){
        this.isTextVisible = true;
        this.color = "red";
      }
    });
  }
  
  /*onSubmit(){
    this.appService.getUsers().subscribe((data) => {
      this.users = data as User[];

      for(this.user of this.users){
        if(this.user.name === this.userForm.value.username){
          this.isUsernameVisible = true;
          if(this.user.email === this.userForm.value.email){
            this.isEmailVisible = true;
          }else{
            this.isEmailVisible = false;
          }
          return;
        }else{
          this.isUsernameVisible = false;
        }
      }

      for(this.user of this.users){
        if(this.user.email === this.userForm.value.email){
          this.isEmailVisible = true;
          return;
        }else{
          this.isEmailVisible = false;
        }
      }

      if(!this.userForm.valid){
        this.color = "red";
        this.isVisible = !this.isVisible;
      }else{
        var username = (document.getElementById('username') as HTMLInputElement).value;
        var password = (document.getElementById('password') as HTMLInputElement).value;
        var email = (document.getElementById('email') as HTMLInputElement).value;
    
        this.user.name = username;
        this.user.password = password;
        this.user.email = email;
    
        this.appService.createUser(this.user).subscribe(data => this.user);
        this.router.navigate(['/login']);
      }

    })
  }*/

}
