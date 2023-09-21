import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { Observable } from 'rxjs';
import { Login } from '../sharedcomponents/login';
import { BackendservicesService } from '../sharedcomponents/backendservices.service';
import { AuthenticationserviceService } from '../authenticationservice.service';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AfterloginserviceService {
  data: any[] = [];
  token: any;
  salesunitguard: boolean = false;
  Adminguard: boolean = false;
  spguard: boolean = false;
  isMatch: boolean = false;
  roles: any;
  constructor(private http: HttpClient,private router: Router, private loginapi: BackendservicesService, private cookieservice: CookieService, private authservice: AuthenticationserviceService) { }
  login(value: any) {
    this.loginapi.login(value).subscribe((res: Login) => {
      if (res.token !== null) {
        // alert(res.token)
        this.token = res.token;
        let decoded: any = jwt_decode(res.token);
        let email: string = decoded['email'];
        let roles: string = decoded['role'];
       this.cookieservice.set("token", this.token);
        localStorage.setItem('Token', res.token);
       
        if (roles == "ADMIN") {
          this.Adminguard = true;
          this.salesunitguard = true;
          this.spguard = false;
          this.router.navigate(['/admin']);
        } else if (roles == "Sales_Unit") {
          this.Adminguard = false;
          this.salesunitguard = true;
          this.spguard = false;
          this.router.navigate(['/SalesUnitDashboard']);
          
        } else if (roles == "Solution_Partner") {

          this.Adminguard = false;
          this.salesunitguard = false;
          this.spguard = true;
          // console.log('spdashboard');
          this.router.navigate(['/SPDashboard']);
        } else {
          alert("Your role is not found!")
          console.log('forbidden');
          // this.router.navigate(['/forbidden']);
        }
      }
    });
  }
  gettoken(){
    return this.token;
  }
  userdata(){
    // this.data.length = 0;
    if(this.cookieservice.get('token') !== ''){
      let decoded: any = jwt_decode(this.cookieservice.get('token'));
      let user_id: string = decoded['user_id'];
      let company_registered_id: string = decoded['company_registered_id'];
      let role: string = decoded['role'];
      let permission: string = decoded['permission'];
      this.data.push({
        'user_id': user_id,
        'company_registered_id': company_registered_id,
        'role': role,
        //'token': this.token,
        'token': localStorage.getItem('Token'),
        'permission': permission
      });
    }
    return this.data; 
  }

  isAdmin(){
    console.log(this.Adminguard + ' admin verify');
    return this.Adminguard;
  }

  redirectto(){
    console.log("call ADMIN method");
    this.Adminguard = true;
    return this.Adminguard;
  }

  isSalesunit(){
    console.log(this.salesunitguard + ' salesunit verify');
    return this.salesunitguard;
  }
  redirecttosalesunit(){
    console.log("call SU method");
    this.salesunitguard = true;
    return this.salesunitguard;
  }
  redirecttosolution(){
    console.log("call sp method");
    this.salesunitguard = false;
    this.Adminguard = false;
    this.spguard = true;
    return this.spguard;
  }
  isSpartner(){
    console.log(this.spguard + ' solutionpartner verify');
    return this.spguard;
  }
  
  public rolematch(role: any): any {
    // let tokens: any = this.authservice.gettoken();
    // let decoded: any = jwt_decode(tokens);
    // this.roles = decoded['resource_access']['dc-mh-hosting']['roles'];
    this.roles = ['spm_admin', 'spm_partner', 'spm_salesunit'];
    if (this.roles != null) {
      for (let i = 0; i <= this.roles.length; i++) {
        for (let j = 0; j <= role.length; j++) {
          if (this.roles[i] === role[j] && this.roles[i] !== undefined) {
            alert('Role Is Available');
            return this.isMatch = true;
          }
          else {
            alert('Role is not match');
            this.isMatch = false;
          }
        }
      }
    } else {
      return this.isMatch = false;
    }
    return this.isMatch;
  }

}
