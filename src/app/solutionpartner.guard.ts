import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginserviceService } from './loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class SolutionpartnerGuard implements CanActivate {
  constructor(private router: Router, private loginservice: LoginserviceService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isspartner = this.loginservice.isSpartner();
      console.log(isspartner + " SP From auththentication guard");
      if(!isspartner){
        console.log("Partner guard - false");
        return false;
      }
      return true;
  }
  
}
