import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';  //Observable = promise જેવું જ છે (but powerful)
                                          //API થી token આવે → તેને localStorage માં save કરવું છે → એટલે tap વાપર્યું.

@Injectable({ providedIn: 'root' })
export class AuthService {  

private apiUrl = 'http://192.168.1.136:8000/api/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token); 
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}