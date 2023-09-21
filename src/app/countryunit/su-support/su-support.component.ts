import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-su-support',
  templateUrl: './su-support.component.html',
  styleUrls: ['./su-support.component.scss']
})
export class SuSupportComponent implements OnInit {
  contact_request_username: any;
  contact_us_request: any = [];
  product: any = [];
  generalenquiries: any = [];
  service: any = [];
  training: any = [];
  feedback: any = [];
  bugreport: any = [];
  featurerequest: any = [];
  suggestion: any = [];
  print: any;
  salesunit_id: any;
  counter: number = 1;
  AddContactDetails: any= FormGroup;
  check_status: boolean = false;
  message: any;
  token: any;
  httpHeader: any;
  constructor(private cookieservice: CookieService, private authservice: AuthenticationserviceService, private router: Router, private getdata: AfterloginserviceService, private formBuilder: FormBuilder, private http: HttpClient) { 
    this.getdata.userdata().forEach((element: any) => {
      this.salesunit_id = element.userID;
      this.token = element.token;
    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
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

    this.contact_us_request.length = 0;
    this.http.get<any>(environment.baseurl + "salesunit_contact_us.php?token="+this.token).subscribe((res: any) =>{
      this.contact_request_username = res;
      this.contact_request_username.forEach((element: any) => {
        const contact_us_id: any = element.contact_us_id;
        const company_name: any = element.company_name;
        const reason_for_contact: any = element.reason_for_contact;
        if(this.counter == 1){
          this.check_status = true;
          this.getcontactdetails(element.contact_us_id);
        }else{
          this.check_status = false;
        }
        this.counter = this.counter + 1;
        this.contact_us_request.push({
          'contact_us_id' : contact_us_id,
          'company_name' : company_name,
          'reason_for_contact' : reason_for_contact,
          'checked' : this.check_status
        });
        // console.log(this.fasttrack_closed_results);
      });
      this.contact_request_username.forEach((element: any) => {
        if(element.reason_for_contact == "products"){
          this.product.push({
            'company_name' : element.company_name,
            'contact_us_id' : element.contact_us_id
          });
          // console.log(this.product);
        } else if(element.reason_for_contact == "generalenquiries"){
          this.generalenquiries.push({
            'company_name' : element.company_name,
            'contact_us_id' : element.contact_us_id
          });
        } else if(element.reason_for_contact == "training"){
          this.training.push({
            'company_name' : element.company_name,
            'contact_us_id' : element.contact_us_id
          });
        } else if(element.reason_for_contact == "service"){
          this.service.push({
            'company_name' : element.company_name,
            'contact_us_id' : element.contact_us_id
          });
        } else if(element.reason_for_contact == "feedback"){
          this.feedback.push({
            'company_name' : element.company_name,
            'contact_us_id' : element.contact_us_id
          });
        } else if(element.reason_for_contact == "bugreport"){
          this.bugreport.push({
            'company_name' : element.company_name,
            'contact_us_id' : element.contact_us_id
          });
          
        } else if(element.reason_for_contact == "featurerequest"){
          this.featurerequest.push({
            'company_name' : element.company_name,
            'contact_us_id' : element.contact_us_id
          });
        } else if(element.reason_for_contact == "suggestion"){
          this.suggestion.push({
            'company_name' : element.company_name,
            'contact_us_id' : element.contact_us_id
          });
        }
      });
    });

    this.AddContactDetails = this.formBuilder.group({
      id: ['', Validators.required],
      first_name: [{value: 'Please Select', disabled: true}, Validators.required],
      last_name: [{value: 'Please Select', disabled: true}, Validators.required],
      email: [{value: 'Please Select', disabled: true}, Validators.required],
      mobile: [{value: 'Please Select', disabled: true}, Validators.required],
      postalcode: [{value: 'Please Select', disabled: true}, Validators.required],
      city: [{value: 'Please Select', disabled: true}, Validators.required],
      country: [{value: 'Please Select', disabled: true}, Validators.required],
      company_name: [{value: 'Please Select', disabled: true}, Validators.required],
      reason_for_contact: [{value: 'Please Select', disabled: true}, Validators.required],
      description: [{value: 'Please Select', disabled: true}, Validators.required]
    });
    $('.module-accordion').moduleAccordion();
  }
  getcontactdetails(cid: any){
    this.http.get<any>(environment.baseurl + "admin_contact_us_detailsbyid.php?token="+this.token+"&contactUs_id="+cid).subscribe((res: any) =>{
      this.print = res;
      this.print.forEach((element: any) => {
        this.AddContactDetails.patchValue({
          id: element.contact_us_id,
          first_name: element.first_name,
          last_name: element.last_name,
          email: element.email,
          country: element.country,
          company_name: element.company_name,
          mobile: element.mobile,
          postalcode: element.postalcode,
          city: element.city,
          reason_for_contact: element.reason_for_contact,
          description: element.description
        })
      });
    });
  }
  uncheckOther(chk: any, event: any) {
    if (event) {
      //uncheck all checkbox
      this.bugreport.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      this.generalenquiries.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })

      this.product.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      this.training.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      this.service.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      this.feedback.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      this.featurerequest.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      this.suggestion.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })

      this.contact_us_request.forEach((x: any) => {
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
  solvedrequest(){
    this.http.post<any>(environment.baseurl + "contactus_solvedreq.php", this.AddContactDetails.value,{headers: this.httpHeader}).subscribe((res: any) =>{
      if(res.ok === true){
        $('#messagebox').moduleModal('open');
        this.message = res.message;
        this.ngOnInit();
      }else{
        $('#messagebox').moduleModal('open');
        this.message = res.message;
      }
      this.ngOnInit();
    });
  }
}
