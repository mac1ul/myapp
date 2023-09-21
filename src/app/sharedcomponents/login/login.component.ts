import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jwt_decode from "jwt-decode";
import { Login } from "../login";
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from '../../services/afterloginservice.service';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DatePipe]
})
export class LoginComponent implements OnInit {
  status: boolean = false;
  loginform: any = FormGroup;
  token: any;
  // roles: any;
  // email: any;
  show: boolean = false;
  httpHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'token': 'token'
  })
  latest_date:any;
  last_login_date: any;
  constructor(private datePipe: DatePipe, private cookieservice: CookieService, private loginservice: LoginserviceService, private authservice: AuthenticationserviceService, private afterloginservice: AfterloginserviceService, private formBuilder: FormBuilder, private router: Router, private http: HttpClient) {
    // this.token = this.authservice.gettoken();
    // const afterlogintoken: any = localStorage.getItem('sso_token');
    // const webToken: any = localStorage.getItem('Token');
    // if(this.token === '' || afterlogintoken === ''){
    //   this.authservice.authentication();

    // }
    // if(webToken === ''){
    //   // redirect to login
    // }else{
    //   this.afterloginservice.userdata().forEach((element: any) => {
    //     this.roles = element.role;
    //     if(this.roles === "ADMIN"){
    //       this.router.navigate(['/admin']);
    //     }else if(this.roles === "Sales_Unit"){
    //       this.router.navigate(['/SalesUnitDashboard']);
    //     }else if(this.roles === "Solution_Partner"){
    //       this.router.navigate(['/SPDashboard']);
    //     }
    //   })
    // }
    // let decoded: any = jwt_decode(afterlogintoken);
    // this.email = decoded['email'];
    // if(this.email === "edgar.koepplin@boschrexroth.de" || this.email === "akshaykumar.gadhiya@boschrexroth.de" || this.email === "shubham.narkhede@boschrexroth.de"){
    //   this.show = true;
    // }else{
    //   this.show = false;
    // }

    // this.latest_date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    // this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/getlastlogindate.php?userid="+ this.email).subscribe((res : any) =>{
    //     this.last_login_date = res;
    //     alert(this.last_login_date)
    //     alert(this.last_login_date.length)
    //     if(res == this.latest_date){
    //       alert("Same Password")
    //     }else{
    //       alert("Session Refresh Alert")
    //       if(this.last_login_date.length >= 5){
    //           this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/removepassword.php?userid="+ this.email).subscribe((res : any) =>{
    //           if(res.ok == true){
    //             // alert("Call Logout Process")
    //               this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/sessiondestroy.php").subscribe((res: any) =>{
    //                 console.log('logout from Admin');
    //               });
    //               sessionStorage.clear();
    //               localStorage.removeItem('sso_token');
    //               localStorage.removeItem('Token');
    //               this.cookieservice.deleteAll();

    //               // logout endpoint
    //               setTimeout(()=>{
    //                 window.location.href = "https://p1.authz.bosch.com/auth/realms/dc/protocol/openid-connect/logout?post_logout_redirect_uri=https://mobilehydraulics.boschrexroth.com/2022/SPM/v3/test_version";
    //               },500)
    //           }
    //           });
    //         }
    //     }
    // });
  }

  ngOnInit(): void {
    $('.module-header').moduleHeader();
    $('.module-language-location-select').moduleLanguageLocationSelect();

    this.loginform = this.formBuilder.group({
      email: ['akshaykumar.gadhiya@boschrexroth.de', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    // this.loginservice.login(this.loginform.value);

    this.afterloginservice.login(this.loginform.value);
  }
}
