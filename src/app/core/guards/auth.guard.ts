import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('token');

    return new Observable<boolean>(observer => {
      if (token) {
        // User is authenticated, redirect to home
        this.router.navigate(['/']);
        observer.next(false);
      } else {
        // User is not authenticated, allow access
        observer.next(true);
      }
      observer.complete();
    });
  }
}