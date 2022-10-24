import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  p:number = 1;
  users: any = [];
  user = new User();

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(){
    this.appService.getUsers().subscribe((data) => {
      this.users = data;
    })
  }

  onChange(event: any, user: any){
    this.user = user;
    this.user.role = event.target.value;
    this.appService.setRole(this.user).subscribe((data) => {
      console.log(data);
    });
  }

}
