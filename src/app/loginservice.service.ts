import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BackendservicesService } from './sharedcomponents/backendservices.service';
import { Login } from './sharedcomponents/login';
import jwt_decode from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {
  data: any[] = [];
  storedata: any[] = [];
  token: any;
  salesunitguard: boolean = false;
  Adminguard: boolean = false;
  spguard: boolean = false;
  constructor(private httpClient: HttpClient, private apiService: BackendservicesService, private router: Router, private cookieservice: CookieService) { }

  login(value: any) {
    this.apiService.login(value).subscribe((res: Login) => {
      if (res.token !== null) {
        // alert(res.token)
        this.token = res.token;
        
        localStorage.setItem('Token', res.token);
        this.cookieservice.set("token", this.token);

        let decoded: any = jwt_decode(res.token);
        let email: string = decoded['email'];
        let role: string = decoded['role'];

        if (role == "Solution_Partner") {
          this.Adminguard = false;
          this.salesunitguard = false;
          this.spguard = true;
          this.router.navigate(['SPDashboard']);
        } else if (role == "ADMIN") {
          this.Adminguard = true;
          this.router.navigate(['admin']);
        } else if (role == "Sales_Unit") {
          this.Adminguard = false;
          this.salesunitguard = true;
          this.spguard = false;
          this.router.navigate(['salesunitdashboard']);
        } else {
          this.router.navigate(['login']);
        }
      }
      return this.token, this.Adminguard, this.salesunitguard, this.spguard;
    });
  }
  gettoken() {
    return this.token;
  }

  userdata() {
    // this.data.length = 0;
    if (this.cookieservice.get('token') !== '') {
      let decoded: any = jwt_decode(this.cookieservice.get('token'));
      let email: string = decoded['email'];
      let role: string = decoded['role'];
      let userID: string = decoded['userID'];
      let permission: string = decoded['permission'];
      let solutionpartner_registered_id: string = decoded['solutionpartner_registered_id'];
      this.data.push({
        'email': email,
        'role': role,
        'userID': userID,
        'token': this.cookieservice.get('token'),
        'permission': permission,
        'Solution_Partner_id': solutionpartner_registered_id
      });
    }
    return this.data;
  }

  idAdmin() {
    console.log(this.Adminguard + ' admin verify');
    return this.Adminguard;
  }

  isSalesunit() {
    console.log(this.salesunitguard + ' salesunit verify');
    return this.salesunitguard;
  }

  isSpartner() {
    console.log(this.spguard + ' solutionpartner verify');
    return this.spguard;
  }

}
