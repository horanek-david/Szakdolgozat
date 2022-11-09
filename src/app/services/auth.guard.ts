import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router
  ){}
  canActivate(){
    const token = localStorage.getItem('token');
    if(token){
      return true;
    }else {
      this.router.navigate(['login']);
      return false;
    }
  }  
}

@Injectable()
export class IsSignedInGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(){
    const token = localStorage.getItem('token');

    if(token) {
      this.router.navigate(['webshop']);
      return false;
    }
    return true;
  }
}
