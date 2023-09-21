import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SetbreadcrumbService } from 'src/app/countryunit/setbreadcrumb.service';
import { environment } from 'src/environments/environment';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
declare var $: any;
@Component({
  selector: 'app-partners-projectdetails',
  templateUrl: './partners-projectdetails.component.html',
  styleUrls: ['./partners-projectdetails.component.scss']
})
export class PartnersProjectdetailsComponent implements OnInit {

  sp_registered_id: any;
  projectdata: any=[];

  rowsPerPage: number = 10;
  actualPage: number = 1;
  endPaging: any;
  showProducts: any;
  showprevnext: boolean = false;
  projectnumbercheck: boolean = false;
  message: any;

  breadcrumb_partner_id: any;
  breadcrumbdata: any;
  breadcrumb_salesunit_id: any;
  addproject: any= FormGroup;
  // current User information
  email: string = '';
  editable: boolean = false;
  updatedData: any[] = [];
  token: string = "";
  httpHeader: any;
  expired: boolean = false;
  submitted = false;
  partnerCompanyName:any ;
  constructor( private getdata:BackendservicesService ,private breadcrumb: SetbreadcrumbService, private formBuilder: FormBuilder,private routes: ActivatedRoute,private router: Router, private http: HttpClient) {
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/breadcrumb.php?machine_id=" + this.routes.snapshot.paramMap.get('partner_id') + "&status=projectinfo").subscribe((res: any) => {
      this.breadcrumbdata = res;
      this.breadcrumbdata.forEach((element: any) => {
        this.breadcrumb_salesunit_id = element.country_unit_registred_id;
      });
    });


    this.getdata.userdata().forEach(element => {
      this.token = element.token;

    });

    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
  }

  ngOnInit(): void {
    this.sp_registered_id = this.routes.snapshot.paramMap.get('partner_id');
   //this.sp_registered_id = this.routes.snapshot.paramMap.get('solutionpartner_registered_id');
    this.http.get<any>(environment.adminBaseUrl+"Solution_partner_Name.php?sp_registered_id="+this.sp_registered_id+"&token="+this.token).subscribe((res: any) =>{
      this.partnerCompanyName = res[0].solution_partner_company_name;
    });


    this.http.get<any>(environment.adminBaseUrl+"Overview_GetAllProject.php?sp_registered_id="+this.sp_registered_id+"&token="+this.token).subscribe((res: any) =>{
        this.projectdata = res;
        if(this.projectdata.length == 0){
          this.projectnumbercheck = true;
          this.message = "Project is not found.";
        }
    });

    this.addproject = this.formBuilder.group({
      projectnumber: ['', Validators.required],
      projectname: ['', Validators.required],
      location: ['', Validators.required],
      sp_registered_id: this.sp_registered_id
    });
  }

  GoToMachine(MachineId: any){
    console.log(MachineId)
    this.router.navigate(['/Project_MachineList',MachineId ]);
  }

  onclickSales(){
    this.breadcrumb.onclickSalesunit();
  }
  onclickPartner(){
    this.breadcrumb.onclickPartnerdetails(this.breadcrumb_salesunit_id);
  }
  prevnext(){
    this.showprevnext = true;
  }
}
