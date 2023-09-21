import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var $: any;
import { LoginserviceService } from '../../loginservice.service';
import { CookieService } from 'ngx-cookie-service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-su-dashboard',
  templateUrl: './su-dashboard.component.html',
  styleUrls: ['./su-dashboard.component.scss']
})
export class SuDashboardComponent implements OnInit {
  userdata: any;
  token: any;
  emailid: string = '';
  permission: string = '';
  salesunit_id: any;
  access: any;
  role: string = '';
  count: any;
  price_count: any;
  info: any;
  constructor(private cookieservice: CookieService,  private authservice: AuthenticationserviceService, private LoginserviceService: AfterloginserviceService, private getdata: BackendservicesService, private Router: Router, private http: HttpClient) {
    this.LoginserviceService.userdata().forEach(element => {
      this.token = element.token;
      this.emailid = element.email;
      this.salesunit_id = element.userID;
      this.permission = element.permission;
      this.role = element.role;
      if(this.permission === "fullaccess"){
        this.access = true;
        // alert(this.access)
      }else{
        this.access = false;
        // alert(this.access)
      }
    });
    // console.log(this.token + " " + this.emailid + " " + this.role);
  }

  ngOnInit(): void {
    // this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/getSalesunitinformation.php?company_id="+this.salesunit_id).subscribe((res : any) =>{
    //   if(res.ok === true){
    //     this.info = res.message;
    //   }
    // });

    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/checktokenduration.php?token="+this.token).subscribe((res : any) =>{
      if(res.ok === true){
        console.log(res.message)
      }else{
        this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/sessiondestroy.php").subscribe((res: any) =>{
          console.log('Your session is expired!');
        });
        localStorage.clear();
        this.cookieservice.deleteAll();
        sessionStorage.clear();
        alert(res.message)
        setTimeout(()=>{
          window.location.href = "https://p1.authz.bosch.com/auth/realms/dc/protocol/openid-connect/logout?post_logout_redirect_uri=https://mobilehydraulics.boschrexroth.com/spm_testversion3.0/Demo";
        },200)
        // alert(res.message)
        // this.authservice.authentication();
      }
    });

    this.http.get<any>(environment.baseurl + "Fasttrack_count.php?token="+this.token).subscribe((res: any) =>{
      this.count = res;
      if(this.count == ''){
        this.count = '0';
      }
      // console.log(this.getsolutionpartner);
    });
    this.http.get<any>(environment.baseurl +"PriceRequest_count.php?token="+this.token).subscribe((res: any) =>{
      this.price_count = res;
      if(this.price_count == ''){
        this.price_count = '0';
      }
      // console.log(this.getsolutionpartner);
    });
  }
  configurator(){
    window.open("https://bit.ly/2JpYAiR", "_blank");
  }
  myrexroth(){
    window.open("https://www.boschrexroth.com/en/xc/myrexroth/myrexroth-search?p_p_id=101&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_101_struts_action=%2Fasset_publisher%2Fview_content&_101_assetEntryId=24137481&_101_type=content&_101_redirect=https%3A%2F%2Fwww.boschrexroth.com%2Fen%2Fweb%2Fxc%2Fmyrexroth%2Fmyrexroth-search%3Fp_p_id%3D3%26p_p_lifecycle%3D0%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_col_id%3Dcolumn-1%26p_p_col_count%3D1%26_3_vocabId_3825778%3D%26_3_cur%3D1%26_3_vocabId_4354720%3D4598503%26_3_sortReverted%3Dundefined%26_3_keywords%3D%26_3_formDate%3D1593172896360%26_3_groupId%3D0%26_3_format%3D%26_3_delta%3D20%26_3_documentsSearchContainerPrimaryKeys%3D15_PORTLET_24308724%26_3_vocabId_3833197%3D%26_3_vocabId_5334676%3D%26_3_sortField%3D%26_3_assetTagNames%3Dmobile_solution_partner%26_3_struts_action%3D%252Fsearch%252Fsearch%26_3_applyFilter%3Dfalse&_101_urlTitle=system-integrator-general-information&inheritRedirect=true", "_blank");
  }
}
