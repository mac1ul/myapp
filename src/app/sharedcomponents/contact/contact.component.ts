import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { Router } from '@angular/router';
declare var $: any;
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  AddContactData: any= FormGroup;
  email: string = '';
  solution_partner_id: string = '';
  role: string = '';
  prefilleddata: any;
  submitted = false;
  token: any;
  httpHeader: any;
  constructor(private Router: Router, private LoginserviceService: AfterloginserviceService, private formBuilder: FormBuilder, private http: HttpClient, private getdata: BackendservicesService) {
    this.LoginserviceService.userdata().forEach(element => {
      this.email = element.email;
      this.solution_partner_id = element.userID;
      this.role = element.role;
      this.token = element.token;
    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
  }

  ngOnInit(): void {
    if(this.solution_partner_id !== null){
      this.http.get<any>(environment.baseurl + "get_personal_details.php?token="+this.token+"&role="+this.role).subscribe((res : any) =>{
        if(res !== null){
          this.prefilleddata = res;
          if(this.role == "Sales_Unit"){
            this.prefilleddata.forEach((element: any) => {
              this.AddContactData.patchValue({
                first_name: element.first_name,
                last_name: element.last_name,
                email: element.partner_email_address,
                country: element.location,
                company_name: element.partner_company_name
              })
            });
          }else{
            this.prefilleddata.forEach((element: any) => {
              this.AddContactData.patchValue({
                first_name: element.first_name,
                last_name: element.last_name,
                email: element.email,
                country: element.location_name,
                company_name: element.solution_partner_company_name
              })
            });
          }
        }
      });
    }
    $('.module-textarea').moduleInput();

    this.AddContactData = this.formBuilder.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      mobile: [''],
      postalcode: [''],
      city: ['', Validators.required],
      country: [''],
      company_name: [''],
      reason_for_contact: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  get f()
  {
    return this.AddContactData.controls;
  }
  SendContactForm(){
    this.submitted = true;
    // stop here if form is invalid
    // if (this.AddContactData.invalid) {
    //   return;
    // }
    // console.log(this.AddContactData.value)
    this.http.post<any>(environment.baseurl + "ContactUs.php", {data: this.AddContactData.value}, {headers: this.httpHeader}).subscribe((res : any) =>{
        if(res.okay === true){
          alert(res.message);
          this.Router.navigate(['/SalesUnitDashboard']);
          // this.AddContactData.reset();
        }else{
          alert(res.message)
        }
    });
    this.ngOnInit();
  }
}
