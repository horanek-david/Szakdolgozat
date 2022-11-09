import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";

import { User } from '../model/user';
import { Clothes } from '../model/clothes';
import { Cart } from '../model/cart';
import { Filter } from '../model/filter';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  serviceURL = 'http://localhost:4000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  cloth = new Clothes();

  constructor(private http: HttpClient, private router: Router) { }

  getUser(data: User): Observable<User> {
    const url = `${this.serviceURL}/login`;    //Write out the logged in user using the server.js function.
    return this.http.post<User>(url, data);
  }

  createUser(data: User): Observable<User>{
    const url = `${this.serviceURL}/register`;    //Sending back a User type data to the backend (The one that we registrated).
    return this.http.post<User>(url, data);
  }

  getClothes(search: string){
    return this.http.get(`${this.serviceURL}/clothes/${search}`).pipe(catchError(this.handleError));     //Write out the users using the server.js function.
  }                                                                                                     //The search parameter will be the filter.

  deleteCloth(id: any){
    const url = `${this.serviceURL}/delete/${id}`;      //Sending back the cloth's id.
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  createCloth(data: Clothes): Observable<Clothes> {   //Sending back the cloth in the "body".
    const url = `${this.serviceURL}/create`;
    return this.http.post<Clothes>(url, data).pipe(catchError(this.handleError));
  }

  getAllCloth() {
    return this.http.get(`${this.serviceURL}/allcloth/`).pipe(catchError(this.handleError));     //Getting all the clothes.
  }

  updateCloth(data: Clothes): Observable<Clothes>{        //Sending back the cloth in the "body".
    const url = `${this.serviceURL}/update`;
    return this.http.put<Clothes>(url, data).pipe(catchError(this.handleError));
  }

  addCart(data: Cart): Observable<Cart> {   
    const url = `${this.serviceURL}/addcart`;
    return this.http.post<Cart>(url, data).pipe(catchError(this.handleError));
  }

  getCart(id: any){
    return this.http.get(`${this.serviceURL}/getcart/${id}`).pipe(catchError(this.handleError));     //Write out the users using the server.js function.
  } 

  deleteCartCloth(id: any){
    const url = `${this.serviceURL}/deletecart/${id}`;      //Sending back the cloth's id thats in the cart to delete it.
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  getFilterClothes(data: any): Observable<Filter>{
    const url = `${this.serviceURL}/filter`;        //Write out the clothes using the server.js filter function.
    return this.http.post<Filter>(url, data).pipe(catchError(this.handleError));
  }

  buyClothes(data: Cart): Observable<Cart>{        //Sending back the bougth clothes in the "body".
    const url = `${this.serviceURL}/bought`;
    return this.http.post<Cart>(url, data).pipe(catchError(this.handleError));
  }

  getUsers() {
    return this.http.get(`${this.serviceURL}/users`).pipe(catchError(this.handleError));     //Getting all the users.
  }

  setRole(data: User): Observable<User>{        //Sending back the bougth clothes in the "body".
    const url = `${this.serviceURL}/updaterole`;
    return this.http.put<User>(url, data).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse){
    if(error.status === 403){
      console.log("JWT no match");
      localStorage.clear();
    }else if( error.status === 401){
      console.log("No JWT Token");
    }
    return throwError(() => error);
  }

}