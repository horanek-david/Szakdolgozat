import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  helper = new JwtHelperService();
  
  canActivate(){
    const token = localStorage.getItem("token");
    const decodedToken = this.helper.decodeToken(String(token));

    if(decodedToken.role === "admin"){
      return true;
    }else{
      return false;
    }
    
  }  
}
