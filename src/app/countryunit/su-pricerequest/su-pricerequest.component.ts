import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-su-pricerequest',
  templateUrl: './su-pricerequest.component.html',
  styleUrls: ['./su-pricerequest.component.scss']
})
export class SuPricerequestComponent implements OnInit {
  projectinformation: any;
  materiallist: any;
  sp_company_name: any;
  salesunit_id: any;
  fasttrack_name: any;
  closed_price_req: any = [];
  fasttrack_body: any;
  alert: boolean = false;
  selected_pricerequest_id: any;
  message: any;
  price_closed_request: any;
  counter: number = 1;
  check_status: boolean = false;
  token: any;
  previouscheck: boolean = true;
  showDeleteAction: boolean = false;
  py=new Date().getFullYear();
  currentYear: any = this.py;
  previousYear1 = this.currentYear - 1;
  previousYear2: any = this.previousYear1 - 1;
  futureYear1 = this.currentYear + 1;
  futureYear2: any = this.futureYear1 + 1;
  futureYear3 = this.futureYear2 + 1;
  removeButton :boolean =false;

  constructor(private cookieservice: CookieService, private authservice: AuthenticationserviceService, private router: Router, private getdata: AfterloginserviceService, private http: HttpClient) {
    this.getdata.userdata().forEach(element => {
      this.salesunit_id = element.userID;
      this.token = element.token;
      // console.log(this.salesunit_id)
    });
  }

  ngOnInit(): void {
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
        // this.authservice.authentication();
      }
    });
    
    this.closed_price_req.length = 0;
    this.http.get<any>(environment.baseurl + "salesunit_price_main.php?token="+this.token).subscribe((res: any) =>{
      this.fasttrack_name = res;
      this.fasttrack_name.forEach((element: any) => {
        const price_request_id: any = element.price_request_id;
        const customer_partner_name: any = element.customer_partner_name;
        const status: any = element.status;
        if(this.counter == 1){
          this.check_status = true;
          this.showfulldata(element.price_request_id);
        }else{
          this.check_status = false;
        }
        const price_req_date: any = element.price_req_date;
        this.counter = this.counter + 1;
        this.closed_price_req.push({
          'price_request_id' : price_request_id,
          'customer_partner_name' : customer_partner_name,
          'status' : status,
          'checked' : this.check_status,
          'price_req_date' : price_req_date
        });
      });
    });

    this.http.get<any>(environment.baseurl + "salesunit_get_prsolved.php?salesunit_id="+this.salesunit_id+"&token="+this.token).subscribe((res: any) =>{
      this.price_closed_request = res;
    });

    $('.module-accordion').moduleAccordion();
  }
  showfulldata(selected: any){
    this.alert = true;
    this.http.get<any>(environment.baseurl +"salesunit_pricerequest_body.php?pricerequest_id="+selected+"&token="+this.token).subscribe((res: any) =>{
      this.fasttrack_body = res;
      // console.log(this.fasttrack_body);
    });
  }
  uncheckOther(chk: any, event: any) {
    if (event) {
      this.showDeleteAction = false;
      // Deselect close state
      this.price_closed_request?.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      //uncheck all checkbox
      this.closed_price_req.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      //check the selected
      if (chk.checked == true) {
        chk.checked = false;
      } else {
        chk.checked = true;
      }
    }
    else {
      this.removeButton=!this.removeButton;
      console.log('Call Both API')
    }
  }
  uncheckOtherss(chk: any, event: any){
    
    if (event) {
      this.showDeleteAction = true;
      // Deselect active state
      this.closed_price_req.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      //uncheck all checkbox
      this.price_closed_request.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      //check the selected
      if (chk.checked == true) {
        chk.checked = false;
      } else {
        chk.checked = true;
      }
    }
    else {
      console.log('Call Both API')
    }
  }
  deletemodelclose(){
    $('#messagebox').moduleModal('close');
    this.ngOnInit();
  }
  sendReply(pid: any){
    this.selected_pricerequest_id = pid;
    this.http.get<any>(environment.baseurl + "salesunit_solvedpricereq.php?price_request_id="+pid+"&token="+this.token).subscribe((res: any) =>{
      // this.fasttrack_body = res;
      // console.log(this.fasttrack_body);
      if(res.ok === true){
        $('#messagebox').moduleModal('open');
        this.message = res.message;
      }else{
        $('#messagebox').moduleModal('open');
        this.message = res.message;
      }
    });
  }
  deletePriceRequest(pid: any){
    this.http.get<any>(environment.baseurl + "salesunit_deletePriceRequest.php?price_request_id="+pid+"&token="+this.token).subscribe((res: any) =>{
      // this.fasttrack_body = res;
      // console.log(this.fasttrack_body);
      if(res.ok === true){
        $('#messagebox').moduleModal('open');
        this.message = res.message;
      }else{
        $('#messagebox').moduleModal('open');
        this.message = res.message;
      }
    });
  }
}
