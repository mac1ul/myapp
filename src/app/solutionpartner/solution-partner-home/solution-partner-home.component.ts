import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Router, ActivatedRoute } from '@angular/router';
import { ManagepagesService } from '../managepages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { AuthResponsemodel } from 'src/app/auth-responsemodel';
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
declare var $: any;
@Component({
  selector: 'app-solution-partner-home',
  templateUrl: './solution-partner-home.component.html',
  styleUrls: ['./solution-partner-home.component.scss']
})
export class SolutionPartnerHomeComponent implements OnInit {
  pagecontent: boolean = false;
  buttonclicked: boolean = false;
  email: boolean = false;
  httpHeader: any;
  token: any;
  info: string = "";
  id: string = '';
  constructor(private LoginserviceService: AfterloginserviceService, private authservice: AuthenticationserviceService, private getdata: BackendservicesService, private http: HttpClient, private breadcrumbService: BreadcrumbService,private router: Router, private activatedroute: ActivatedRoute, public ManagepagesService: ManagepagesService, private cookieservice: CookieService) {
    this.ManagepagesService.currenturl();
    this.LoginserviceService.userdata().forEach((element: any) => {
      //this.token = element.token;
      this.token = localStorage.getItem('Token')
      this.id = element.company_registered_id;
    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
  }

  ngOnInit(): void {
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/getCompanyinformation.php?token="+this.token).subscribe((res : any) =>{
      if(res.ok === true){
        this.info = res.message;
      }
    });
    // Security APIs
    // this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/checktokenduration.php?token="+this.token).subscribe((res : any) =>{
    //   if(res.ok === true){
    //     console.log(res.message)
    //   }else{
    //     this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/sessiondestroy.php").subscribe((res: any) =>{
    //       console.log('Your session is expired!');
    //     });
    //     localStorage.clear();
    //     this.cookieservice.deleteAll();
    //     sessionStorage.clear();
    //     alert(res.message)
    //     setTimeout(()=>{
    //       window.location.href = "https://p1.authz.bosch.com/auth/realms/dc/protocol/openid-connect/logout?post_logout_redirect_uri=https://mobilehydraulics.boschrexroth.com/spm_testversion3.0/Demo";
    //     },200)
    //   }
    // });

    // $('.module-header').moduleHeader();
    $('.module-header-user-menu').moduleHeaderUserMenu();
    $('.module-header-navigation').moduleHeaderNavigation();
    // If not yet covered by the regular modal initialisation:
    $('.modal-language-select').moduleModal();
    $('.header-extensions .module-header-search').moduleHeaderSearch();
    $('.module-header-meta-navigation').moduleHeaderMetaNavigation();
    // alert(this.router.url)

    this.breadcrumbService.set('@Dashboard', 'Dashboard');
  }

  checkRouteUrl() {
    return this.router.url == '/SPDashboard/SPDashboard';
  }

  configurator(){
    window.open("https://mobilehydraulics.boschrexroth.com/sdi/linklist/tools.html", "_blank");
  }

  myrexroth(){
    window.open("https://www.boschrexroth.com/de/de/myrexroth/", "_blank");
  }
}
