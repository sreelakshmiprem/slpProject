import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DecodeAuth } from './decode-auth';

export const authGuard: CanActivateFn = (route, state) => {
  const decodeAuth = inject(DecodeAuth);
  const router = inject(Router);

  const user = decodeAuth.currentUser;

  if (user && !user.isExpiry) {
    return true;
  }


  router.navigate(['/login']);
  return false;
};
