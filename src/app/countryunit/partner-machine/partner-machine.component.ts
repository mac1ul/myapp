import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgDynamicBreadcrumbService } from 'ng-dynamic-breadcrumb';
import { SetbreadcrumbService } from "../setbreadcrumb.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-partner-machine',
  templateUrl: './partner-machine.component.html',
  styleUrls: ['./partner-machine.component.scss']
})
export class PartnerMachineComponent implements OnInit {
  filterproject: any[] = [];
  breadcrumb_project_id: any;
  breadcrumb_partner_id: any;
  breadcrumbdata: any;

  rowsPerPage: number = 10;
  actualPage: number = 1;
  endPaging: any;
  showProducts: any;
  countrecord: boolean = false;

  machinepagecontent: boolean = false;
  addmachine: any= FormGroup;
  industrysectors: any[] = [];
  application: any[] = [];
  inlineeditt: boolean = false;
  updatedData: any[] = [];
  httpHeader: any;
  token: any;
  delete_machine_id: any;
  showmessage: string = "Please add machine.";
  projectname: string = '';
  message: any;
  expired: boolean = false;
  submitted = false;
  showprevnext: boolean = false;
  industrysectorgroup1: any;
  disabled_industry_s2: boolean = true;
  constructor(private formBuilder: FormBuilder, private breadcrumb: SetbreadcrumbService, private getdata: AfterloginserviceService, private http: HttpClient, private router: Router, private routes : ActivatedRoute, private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService) {
    this.getdata.userdata().forEach((element: any) => {
      this.token = element.token;
    });
  }

  ngOnInit(): void {
    this.http.get<any>(environment.baseurl + "breadcrumb.php?machine_id="+this.routes.snapshot.paramMap.get('projectid')+"&status=machinepage").subscribe((res: any) =>{
        this.breadcrumbdata = res;
        this.breadcrumbdata.forEach((element: any) => {
          this.breadcrumb_partner_id = element.solutionpartner_registered_id;
          this.breadcrumb_project_id = element.project_id;
        });
    });

    //Get all Industry Sector
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetIndustrySector.php").subscribe((res: any) =>{
      this.industrysectorgroup1  = res;
      this.application = [];
    });

    // this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetIndustrySector_Group2.php").subscribe((res: any) =>{
    //     this.industrysectors = res;
    // });
    // Project Name
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/currentprojectname.php?projectid="+this.routes.snapshot.paramMap.get('projectid')).subscribe((res: any) =>{
        this.projectname = res;
    });

    this.http.get<any>(environment.baseurl + "Salesunit_FilteredMachineByProject.php?projectid="+this.routes.snapshot.paramMap.get('projectid')+"&token="+this.token).subscribe((res: any) =>{
        this.filterproject = res;
        if(this.filterproject.length > 0 ){
          this.countrecord = false;
          this.filterproject = res;
          this.pagination();
          this.updateViewAfterPaginationClicked();
        }else{
          this.countrecord = true;
        }
    });

    this.addmachine = this.formBuilder.group({
      machinename: ['', Validators.required],
      desc: ['', Validators.required],
      industrygroup1: ['', Validators.required],
      industry: ['', Validators.required],
      application: ['', Validators.required],
      phase: ['', Validators.required],
      project_id: this.routes.snapshot.paramMap.get('projectid')
    });
  }
  get f()
  {
    return this.addmachine.controls;
  }

  onchangeindustrysectorGroup(industrysectorgroup: any){
    this.disabled_industry_s2 = false;

    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetIndustrySector_Group2.php?industrygroup="+ industrysectorgroup).subscribe((res: any) => {
      this.industrysectors = res;
    });
  }

  onchangeindustrysector(industrysector: any){
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetApplicationByIndustry.php?industry="+industrysector).subscribe((res: any) =>{
        this.application = res;
    });
  }
  inlineedit(event: any){
    event.editable = true;
  }

  modalToOpen(){
    $('#addmachinemodel').moduleModal('open');
  }

  modalClose(){
    $('#addmachinemodel').moduleModal('close');
  }

  deletemodelclose(){
    $('#opendeletemodel').moduleModal('close');
    $('#messagebox').moduleModal('close');
  }

  save(data: any){
    data.editable = false;
    this.updatedData.length = 0;
    this.updatedData.push({
      "machine_id": data.machine_id,
      "machine_name": data.machine_name,
      "description": data.machine_description,
      "machine_phase": data.machine_phase,
      "industry_sector_1": data.industry_sector_1,
      "industry_sector": data.industry_sector,
      "application": data.application
    });
    // console.log(this.updatedData);
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/UpdateMachineData.php", {data: this.updatedData}).subscribe((res : any) =>{
      if(res.ok === true){
        this.message = res.message;
        $('#messagebox').moduleModal('open');
        this.modalClose();
        this.ngOnInit();
      }else{
          this.expired = true;
          this.message = res.message;
          $('#messagebox').moduleModal('open');
          this.ngOnInit();
      }
    });
  }
  AddMachineData(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.addmachine.invalid) {
      return;
    }
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/addmachinedata.php", {data: this.addmachine.value}).subscribe((res : any) =>{
        if(res.ok === true){
          this.message = res.message;
          $('#messagebox').moduleModal('open');
          this.modalClose();
          this.ngOnInit();
        }else{
            this.expired = true;
            this.message = res.message;
            $('#messagebox').moduleModal('open');
            this.ngOnInit();
        }
    });
  }
  onclickPartner(){
    this.breadcrumb.onclickPartner();
  }

  onclickProject(){
    this.breadcrumb.onclickProject(this.breadcrumb_partner_id);
  }

  onclickMachine(){
    this.breadcrumb.onclickMachine(this.breadcrumb_project_id);
  }

  pagination() {
    if (this.filterproject.length % this.rowsPerPage != 0) {
      this.endPaging = Math.round(this.filterproject.length / this.rowsPerPage)
    } else {
      this.endPaging = this.filterproject.length / this.rowsPerPage
    }
  }
  onPageChange(value: any) {
    this.showprevnext = false;
    this.actualPage = value;
    this.updateViewAfterPaginationClicked();
  }
  onChangeRowsPerPage(value: any) {
    // alert(value)
    this.rowsPerPage = value;
    this.pagination();
    this.actualPage = 1;
    this.updateViewAfterPaginationClicked();
  }
  updateViewAfterPaginationClicked() {
    var start = (this.actualPage - 1) * this.rowsPerPage;
    var end = this.actualPage * this.rowsPerPage - 1;
    this.showProducts = this.filterproject.slice(start, end);
  }

  prevnext(){
    this.showprevnext = true;
  }
}
