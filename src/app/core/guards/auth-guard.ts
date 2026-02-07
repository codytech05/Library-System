import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token && token !== 'undefind' && token !== 'null') {
    return true;
  } else {
    // alert("No token found, redirecting..."); 
    router.navigate(['/login']); 
    return false;
  }
}; 
