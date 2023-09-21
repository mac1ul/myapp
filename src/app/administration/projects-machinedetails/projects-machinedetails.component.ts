import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SetbreadcrumbService } from 'src/app/countryunit/setbreadcrumb.service';
import { environment } from 'src/environments/environment';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';

declare var $: any;
@Component({
  selector: 'app-projects-machinedetails',
  templateUrl: './projects-machinedetails.component.html',
  styleUrls: ['./projects-machinedetails.component.scss']
})
export class ProjectsMachinedetailsComponent implements OnInit {
  httpHeader: any;
  token: any;
  filterproject: any[] = [];
  breadcrumb_project_id: any;
  breadcrumb_partner_id: any;
  breadcrumbdata: any= [];
  rowsPerPage: number = 10;
  actualPage: number = 1;
  endPaging: any;
  showProducts: any;
  showprevnext: boolean = false;
  countrecord: boolean = false;
  machinepagecontent: boolean = false;
  addmachine: any = FormGroup;
  industrysectors: any[] = [];
  application: any[] = [];
  inlineeditt: boolean = false;
  updatedData: any[] = [];
  delete_machine_id: any;
  showmessage: string = "Please add machine.";
  projectname: string = '';
  message: any;
  expired: boolean = false;
  submitted = false;
  breadcrumb_salesunit_id: any;
  industrysectorgroup1: any;

  disabled_industry_s2: boolean = true;
  constructor( private getdata:BackendservicesService ,private breadcrumb: SetbreadcrumbService, private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private routes: ActivatedRoute) {
    this.getdata.userdata().forEach(element => {
      this.token = element.token;
    });

    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
  }

  ngOnInit(): void {
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/breadcrumb.php?machine_id=" + this.routes.snapshot.paramMap.get('project_id') + "&status=machinepage").subscribe((res: any) => {
      this.breadcrumbdata = res;
      this.breadcrumbdata.forEach((element: any) => {
        this.breadcrumb_partner_id = element.solutionpartner_registered_id;
        this.breadcrumb_project_id = element.project_id;
        this.breadcrumb_salesunit_id = element.country_unit_registred_id;
      });
    });

    // Project Name
    this.http.get<any>(environment.adminBaseUrl+"currentprojectname.php?projectid=" + this.routes.snapshot.paramMap.get('project_id')+"&token="+this.token).subscribe((res: any) => {
      this.projectname = res;
    });

    this.http.get<any>(environment.adminBaseUrl+"FilteredMachineByProject.php?projectid=" + this.routes.snapshot.paramMap.get('project_id')+"&token="+this.token).subscribe((res: any) => {
      this.filterproject = res;
      if (this.filterproject.length > 0) {
        this.countrecord = false;
        this.filterproject = res;
      } else {
        this.countrecord = true;
      }
    });
  }

  onclickSales() {
    this.breadcrumb.onclickSalesunit();
  }
  onclickPartner() {
    this.breadcrumb.onclickPartnerdetails(this.breadcrumb_salesunit_id);
  }
  onclickProject() {
    this.breadcrumb.onclickProjectdetails(this.breadcrumb_partner_id);
  }
}
