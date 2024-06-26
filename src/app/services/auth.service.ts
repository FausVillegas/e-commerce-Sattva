import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';

import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:3000/auth"

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId!: Pick<User, "id">;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(
    private http: HttpClient, 
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) { }

  signup(user: Omit<User,"id">): Observable<User> {
    return this.http
      .post<User>(`${this.url}/signup`, user, this.httpOptions)
      .pipe(
        first(),
        catchError(error => {
          console.error('Signup error', error);
          return this.errorHandlerService.handleError<User>("signup")(error);
        }),
      );
  }

  login(email: Pick<User,"email">, password: Pick<User,"password">): Observable<{ token: string, userId: Pick<User,"id"> }> {    
    return this.http
    .post<{ token: string, userId: Pick<User,"id">, role: string }>(`${this.url}/login`, { email, password }, this.httpOptions)
      .pipe(
        first(),
        tap((tokenObject: { token: string, userId: Pick<User,"id">, role: string }) => {
          this.userId = tokenObject.userId;
          localStorage.setItem("token", tokenObject.token);
          localStorage.setItem("role", tokenObject.role);
          this.isUserLoggedIn$.next(true);
          this.router.navigate(["products"]);
        }),
        catchError(this.errorHandlerService.handleError<{ token: string, userId: Pick<User,"id">, role: string }>("login"))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('administrator');
    this.isUserLoggedIn$.next(false);
  }

  isAuthenticated(): boolean {
    console.log("TOKEN AUTH SERVICE TS "+localStorage.getItem('token'));
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    console.log("ADMIN AUTH SERVICE TS "+localStorage.getItem('role'));
    return localStorage.getItem('role') === "admin";
  }
}
