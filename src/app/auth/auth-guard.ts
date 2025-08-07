import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

//prevents unauthorized access to main content.
export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = sessionStorage.getItem('access');
    if(token){
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};