import { Component, OnInit } from '@angular/core';
import { LoginserviceService } from '../../loginservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-su-prototype',
  templateUrl: './su-prototype.component.html',
  styleUrls: ['./su-prototype.component.scss']
})
export class SuPrototypeComponent implements OnInit {
  showDeleteAction: boolean = false;
  projectinformation: any;
  materiallist: any;
  sp_company_name: any;
  salesunit_id: any;
  fasttrack_name: any;
  fasttrack_body: any;
  alert: boolean = false;
  toggleBool: boolean = false;
  message: string = "";
  contact_person: any;
  selected_fasttrack_id: any;
  email_address: any;
  mail: any= FormGroup;
  fasttrack_closed_request: any;
  fasttrack_closed_results: any = [];
  first_check: any;
  last_check: boolean = false;
  first_raw: boolean = true;
  counter: number = 1;
  check_status: boolean = false;
  token: any;
  checkboxes = [{ checked: false, value: 'Request' }, {
    checked: false,
    value: 'Reservation'
  }];
  constructor(private cookieservice: CookieService, private authservice: AuthenticationserviceService, private router: Router, private formBuilder: FormBuilder, private getdata: AfterloginserviceService, private http: HttpClient ) {
    this.getdata.userdata().forEach((element: any) => {
      this.salesunit_id = element.company_registered_id;
      this.email_address = element.email;
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

    this.fasttrack_closed_results.length = 0;
    this.http.get<any>(environment.suBaseUrl+"salesunit_fasttrack_main.php?salesunit_id="+this.salesunit_id+"&token="+this.token).subscribe((res: any) =>{
      this.fasttrack_name = res;
      // console.log(this.fasttrack_name)
      this.fasttrack_name.forEach((element: any) => {
        const fasttrack_id: any = element.fasttrack_id;
        const customer_name: any = element.customer_name;
        const oem_name: any = element.oem_name;
        const status: any = element.status;
        const fasttrack_date: any = element.fasttrack_date; 
        if(this.counter == 1){
          this.check_status = true;
          this.showfulldata(element.fasttrack_id);
        }else{
          this.check_status = false;
        }
        this.counter = this.counter + 1;
        this.fasttrack_closed_results.push({
          'fasttrack_id' : fasttrack_id,
          'customer_name' : customer_name,
          'oem_name' : oem_name,
          'status' : status,
          'fasttrack_date' : fasttrack_date,
          'check_status' : this.check_status
        });
        // console.log(this.fasttrack_closed_results);
      });
    });
    this.http.get<any>(environment.suBaseUrl+"salesunit_get_ftsolved.php?salesunit_id="+this.salesunit_id+"&token="+this.token).subscribe((res: any) =>{
      this.fasttrack_closed_request = res;
      // console.log(this.fasttrack_closed_request)
      // this.first_check = JSON.stringify(this.fasttrack_closed_request[0]['fasttrack_id']);
      // this.showfulldata(this.first_check);
    });
    this.mail = this.formBuilder.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
    $('.module-accordion').moduleAccordion();
  }
  showfulldata(selected: any){
    // alert(selected)
    this.alert = true;
    this.http.get<any>(environment.suBaseUrl+"salesunit_fasttrack_body.php?fasttrack_id="+selected+"&token="+this.token).subscribe((res: any) =>{
      this.fasttrack_body = res;
      // console.log(this.fasttrack_body);
    });
  }
  uncheckOther(chk: any, event: any) {
    if (event) {
      //uncheck all checkbox
      this.fasttrack_closed_results.forEach((x: any) => {
        if (x.check_status == true)
          x.check_status = false;
      })
      //check the selected
      if (chk.check_status == true) {
        chk.check_status = false;
      } else {
        chk.check_status = true;
      }
    }
    else {
      console.log('Call Both API')
    }
  }
  uncheckOthers(chk: any, event: any){
    if (event) {
      // this.first_raw = false;
      // this.first_check = 0;
      //uncheck all checkbox
      this.fasttrack_closed_request.forEach((x: any) => {
        if (x.check_status == true)
          x.check_status = false;
          // this.first_raw = true;
      })
      //check the selected
      if (chk.check_status == true) {
        chk.check_status = false;
      } else {
        chk.check_status = true;
      }
    }
    else {
      console.log('Call Both API')
    }
  }
  // uncheckOtherss(chk: any, event: any){
    
  //   if (event) {
  //     this.showDeleteAction = true;
  //     // Deselect active state
  //     this.fasttrack_closed_request.forEach((x: any) => {
  //       if (x.checked == true)
  //         x.checked = false;
  //     })
  //     //uncheck all checkbox
  //     this.fasttrack_closed_request.forEach((x: any) => {
  //       if (x.checked == true)
  //         x.checked = false;
  //     })
  //     //check the selected
  //     if (chk.checked == true) {
  //       chk.checked = false;
  //     } else {
  //       chk.checked = true;
  //     }
  //   }
  //   else {
  //     console.log('Call Both API')
  //   }
  // }
  deletemodelclose(){
    $('#messagebox').moduleModal('close');
    this.ngOnInit();
  }
  sendReply(fid: any){
    
    this.selected_fasttrack_id = fid;
    this.http.get<any>(environment.suBaseUrl+"salesunit_solvedprototype.php?fasttrack_id="+fid+"&token="+this.token).subscribe((res: any) =>{
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
    // $('#messagebox').moduleModal('open');
  }
  modalClose2(){
    $('#3dmodels').moduleModal('close');
  }
  replayModel(){
    $('#messagebox').moduleModal('close');
    $('#3dmodels').moduleModal('open');
  }

  sendMail(){
    if(this.selected_fasttrack_id !== ''){
      this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/salesunit_fasttrack_message.php", {'data': this.mail.value, 'fid': this.selected_fasttrack_id}).subscribe((res: any) =>{
        if(res.ok === true){
          alert(res.message)
          this.ngOnInit();
        }else{
          alert(res.message)
        }
        // console.log(this.fasttrack_body);
      });
    }
  }
}
