import { Component, OnInit } from '@angular/core';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Userdata } from "../../solutionpartner/userdata";
import { SetbreadcrumbService } from "../setbreadcrumb.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-partner-project',
  templateUrl: './partner-project.component.html',
  styleUrls: ['./partner-project.component.scss']
})
export class PartnerProjectComponent implements OnInit {
  sp_registered_id: any;
  projectdata: any;
  showProducts: any;
  rowsPerPage: number = 10;
  actualPage: number = 1;
  showprevnext: boolean = false;
  endPaging: any;
  projectnumbercheck: boolean = false;
  message: any;

  breadcrumb_partner_id: any;
  breadcrumbdata: any;

  addproject: any= FormGroup;
  // current User information
  email: string = '';
  editable: boolean = false;
  updatedData: any[] = [];
  token: string = "";
  httpHeader: any;
  expired: boolean = false;
  submitted = false;
  optionControl: boolean = false;
  constructor(private cookieservice: CookieService, private authservice: AuthenticationserviceService, private formBuilder: FormBuilder, private breadcrumb: SetbreadcrumbService, private getdata: AfterloginserviceService, private routes: ActivatedRoute,private router: Router, private http: HttpClient) {
    this.getdata.userdata().forEach((element: any) => {
      this.token = element.token;
    });

    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
  }

  ngOnInit(): void {
    this.sp_registered_id = this.routes.snapshot.paramMap.get('partnerid');
    this.http.get<any>(environment.baseurl + "Overview_GetAllProject.php?token="+this.token+"&sp_registered_id="+this.sp_registered_id).subscribe((res: any) =>{
        this.projectdata = res;
        if(this.projectdata.length == 0){
          this.projectnumbercheck = true;
          this.message = "Project is not found.";
        }
        this.pagination();
        this.updateViewAfterPaginationClicked();
    });

    this.addproject = this.formBuilder.group({
      projectnumber: ['', Validators.required],
      projectname: ['', Validators.required],
      location: ['', Validators.required],
      sp_registered_id: this.sp_registered_id
    });
    this.pagination();
  }
  get f()
  {
    return this.addproject.controls;
  }
  gotologin(){
    $('#messagebox').moduleModal('close');
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/sessiondestroy.php").subscribe((res: any) =>{
      console.log('Your session is expired!');
    });
    localStorage.clear();
    this.cookieservice.deleteAll();
    sessionStorage.clear();
    setTimeout(()=>{
      window.location.href = "https://p1.authz.bosch.com/auth/realms/dc/protocol/openid-connect/logout?post_logout_redirect_uri=https://mobilehydraulics.boschrexroth.com/spm_testversion3.0/Demo";
    },200)
    // this.authservice.authentication();
  }

  editDomain(domain: any){
    domain.editable = true;
  }

  save(data: any){
    data.editable = false;
    this.updatedData.length = 0;
    this.updatedData.push({
      "project_id": data.project_id,
      "project_name": data.project_name,
      "project_number": data.project_number,
      "location": data.location,
      "partner_id": this.sp_registered_id
    });
    // console.log(this.updatedData);
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/UpdateProjectData.php", {data: this.updatedData}).subscribe((res : any) =>{
      if(res.ok === true){
        this.message = res.message;
        $('#messagebox').moduleModal('open');
        this.modalClose();
        this.ngOnInit();
      }else{
          // this.expired = true;
          this.message = res.message;
          $('#messagebox').moduleModal('open');
          this.ngOnInit();
      }
    });
  }

  modalToOpen(){
    // console.log("click")
    $('#createproject').moduleModal('open');
  }

  modalClose(){
    $('#createproject').moduleModal('close');
  }
  deletemodelclose(){
    $('#opendeletemodel').moduleModal('close');
    $('#messagebox').moduleModal('close');
  }
  celledit(){
    this.editable = true;
  }

  OnSubmitPartner(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.addproject.invalid) {
      return;
    }
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/salesunit_addproject.php", this.addproject.value).subscribe((res : any) =>{
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

  pagination() {
    if (this.projectdata.length % this.rowsPerPage != 0) {
      this.endPaging = Math.round(this.projectdata.length / this.rowsPerPage)
    } else {
      this.endPaging = this.projectdata.length / this.rowsPerPage
    }
  }
  onPageChange(value: any) {
    value === this.endPaging - 1 || value === this.endPaging ? this.optionControl = true : this.optionControl = false;
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
    this.showProducts = this.projectdata.slice(start, end);
  }

  prevnext(){
    this.showprevnext = true;
  }
  gotopartnerlist(){
    alert(this.routes.snapshot.paramMap.get('partnerid'))
  }

  GoToMachine(MachineId: any){
   this.router.navigate(['/SalesUnitDashboard/partner_machine_overview',MachineId ]);
  }
  onclickPartner(){
    this.breadcrumb.onclickPartner();
  }
}
