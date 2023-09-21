import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginserviceService } from './loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class SalesunitGuard implements CanActivate {
  constructor(private router: Router, private loginservice: LoginserviceService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const issalesunit = this.loginservice.isSalesunit();
      console.log(issalesunit + " SU From auththentication guard");
      if(!issalesunit){
        console.log("Salesunit guard - false");
        return false;
      }
      return true;
  }
  
}
