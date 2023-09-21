import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ManagepagesService } from '../managepages.service';
import { Userdata } from "../userdata";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
declare var $: any;
@Component({
  selector: 'app-addprojectlist',
  templateUrl: './addprojectlist.component.html',
  styleUrls: ['./addprojectlist.component.scss']
})
export class AddprojectlistComponent implements OnInit {
  pagecontent: boolean = false;
  emailaddress: string = "";
  spid: string = '';
  salesunitdata: any;
  addproject: any= FormGroup;
  // current User information
  superuser: boolean = false;
  partner_company_name: string = '';
  permission: string = '';
  email: string = '';
  editable: boolean = false;
  projectdata: any[] = [];
  isVisible : boolean = false;
  updatedData: any[] = [];
  token: any ;
  httpHeader: any;
  delete_machine_id: any;



  selectedFile: any = File;
  emailid: string = '';
  partner_registered_id: any;
  partner_stock: any;
  global_stock: any;
  lastupdatedate: any;
  
  // pagination
  rowsPerPage: number = 10;
  actualPage: number = 1;
  showprevnext: boolean = false;
  endPaging: any;
  showProducts: any;
  message: string = '';
  recordcount: boolean = false;
  displaymessage: string = "Please add your project information.";
  expired: boolean = false;

  // upload vars 
 selectedMasterFile: any = File;
 filename: any;
 addexcelfiledata: any= FormGroup;
 arrayBuffer:any;
 tables: any[] = [];
  messages: any;


  constructor(private authservice: AuthenticationserviceService, private cookieservice: CookieService, private LoginserviceService: AfterloginserviceService, private getdata: BackendservicesService, private activatedroute: ActivatedRoute, private formBuilder: FormBuilder, private breadcrumbService: BreadcrumbService,private router: Router, public ManagepagesService: ManagepagesService, private http: HttpClient) {
    this.ManagepagesService.currenturl1();
    this.LoginserviceService.userdata().forEach(element => {
      //this.token = element.token;
      this.token = localStorage.getItem('Token')
      // alert(this.token)
      this.emailaddress = element.email;
      this.spid = element.Solution_Partner_id;
    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })

   }

  ngOnInit(): void {

    this.http.get<any>(environment.baseurl +"GetAllProject.php?token="+this.token).subscribe((res: any) =>{
      this.projectdata = res;
      if(this.projectdata.length > 0){
        this.projectdata = res;
        this.recordcount = true;
        this.pagination();
        this.updateViewAfterPaginationClicked();
      }else{
        this.recordcount = false;
      }
    });
    this.addproject = this.formBuilder.group({
      projectnumber: ['', Validators.required],
      projectname: ['', Validators.required],
      location: ['', Validators.required]
    });
    this.pagination();

    this.breadcrumbService.set('@ProjectList', 'Customer Information');
    $('.module-tab-navigation').moduleTabNavigation();
    
  }
  deletemodelopen(machineid: any){
    this.delete_machine_id = machineid;
    $('#opendeletemodel').moduleModal('open');
  }

  deletemodelclose(){
    $('#opendeletemodel').moduleModal('close');
    $('#messagebox').moduleModal('close');
    this.ngOnInit();
  }
  deletemodelclose2(){
    $('#opendeletemodel').moduleModal('close');
    $('#messagebox').moduleModal('close');
    this.ngOnInit();
  }

  gotologin(){
    $('#messagebox').moduleModal('close');
    this.http.get<any>(environment.baseurl + "sessiondestroy.php").subscribe((res: any) =>{
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

  checkRouteUrl() {
    return this.router.url == '/SPDashboard/Add_project';
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
      "location": data.project_location
    });
    console.log(this.updatedData)
    this.http.post<any>(environment.baseurl + "UpdateProjectData.php", {data: this.updatedData},{headers: this.httpHeader}).subscribe((res : any) =>{
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
    $('.component-file-selector').moduleFileSelector();

    
  }

  modalClose(){
    $('#createproject').moduleModal('close');
  }
  celledit(){
    this.editable = true;
  }
  GoToMachine(ProjectId: number){
    this.router.navigate(['/SPDashboard/Add_project/Add_Machine/'+ ProjectId]);
  }

  DeleteMaterials(projectid: any){
    this.http.post<any>(environment.baseurl +'DeleteProject1.php', projectid, { headers: this.httpHeader}).subscribe((res: any) => {
      this.deletemodelclose();
    })
  }
  OnSubmitPartner(){
    this.http.post<any>(environment.baseurl +"addproject.php", {data: this.addproject.value}, { headers: this.httpHeader}).subscribe((res : any) =>{
      if(res.ok === true){
          this.message = res.message;
          $('#messagebox').moduleModal('open');
          console.log('execute');
          console.log(res)
          this.modalClose();
          this.ngOnInit();
      }else if(res.ok === false){
        console.log('execute2')
        console.log(res)
        this.message = res.message;
        console.log(this.message)
          $('#messagebox').moduleModal('open');
          this.modalClose();   
      }else{
          this.expired = true;
          console.log('execute 3')
          console.log(res)
          this.message = res.message;
          console.log(this.message)
          $('#messagebox').moduleModal('open');
         // this.ngOnInit();  
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



  // upload excel to db

  incomingfile(event: any) {
    this.selectedMasterFile = event.target.files[0];
    this.filename = event.target.files[0].name;

  }
  // sendFiledata() {
  //   if (this.filename != null) {
  //     var reg = /(.*?)\.(xlsx)$/;
  //     if (!this.filename.match(reg)) {
  //       alert("Please Select Excel File!");
  //     } else {
  //       let fileReader = new FileReader();
  //       fileReader.onload = (e) => {
  //         this.arrayBuffer = fileReader.result;
  //         var data = new Uint8Array(this.arrayBuffer);
  //         var arr = new Array();
  //         for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  //         var bstr = arr.join("");
  //         var workbook = XLSX.read(bstr, { type: "binary" });
  //         var first_sheet_name = workbook.SheetNames[0];
  //         var worksheet = workbook.Sheets[first_sheet_name];
  //         var XL_row_object = XLSX.utils.sheet_to_json(worksheet, { raw: true });
  //          console.log(XL_row_object)
  //         // this.http.post<any>(environment.suBaseUrl+"Salesunit_StockofSI.php", {data: XL_row_object, userdata: this.partner_registered_id})
  //         // this.http.post<any>(environment.baseurl+"InserStockofSI.php", {data: XL_row_object},{headers: this.httpHeader})
  //         //   .subscribe((response: any) => {
  //         //     if (response.ok === true) {
  //         //       alert("File successfully added");
  //         //       this.ngOnInit();
  //         //     }
  //         //   });
  //         // this.router.navigate(['/customers']);
          

  //       }
  //       fileReader.readAsArrayBuffer(this.selectedMasterFile);
  //     }
  //   } else {
  //     alert("Please select an excel file!")
  //   }
  //   // const Uploaddata = new FormData();
  //   // Uploaddata.append('myFile', this.selectedMasterFile, this.selectedMasterFile.name);
  //   // this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/Salesunit_StockofSI.php", Uploaddata).subscribe((res: any) => {
  //   //   if (res.ok === true) {
  //   //     alert(res.message)
  //   //   } else {
  //   //     alert(res.message)
  //   //   }
  //   // });
  // }


  sendFiledata() {

    if (this.filename != null) {
      var reg = /(.*?)\.(xlsx)$/;
      if (!this.filename.match(reg)) {
        alert("Please Select Excel File!");
      } else {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, { type: "binary" });
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          var XL_row_object = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          console.log(XL_row_object);

          this.http.post<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/addProjectByExcel.php", {data: XL_row_object},{headers: this.httpHeader})
            .subscribe((response: any) => {

              
      //   console.log(response);
  
      // this.ngOnInit();
      if (response.length > 0) {
        // console.log(response);
        $('#createproject').moduleModal('close');
console.log(response);
        this.messages = response;
        // this.displayAddedCustomers = true;
        $('#messagebox').moduleModal('open');
        this.ngOnInit();
      }
      
              // if (response.length > 0) {
                
              //   console.log(response);
              //   // $('#addcustomermodel').moduleModal('close');
              //   // this.addedCustomerList = response;
              //   // this.displayAddedCustomers = true;
              //   // $('#messagebox').moduleModal('open');
              //   this.ngOnInit();
              // }
            });
        }
        fileReader.readAsArrayBuffer(this.selectedMasterFile);
      }
    } else {
      alert("Please select an excel file!")
    }
  }
  downloadFile(){
    const link = document.createElement('a');
    link.setAttribute('target', '_self');
    link.setAttribute('href', environment.baseurl+'/customer_sheet.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }



  incomingfile2(event: any) {
    this.selectedMasterFile = event.target.files[0];
    this.filename = event.target.files[0].name;

  }
  sendFiledata2() {
    if (this.filename != null) {
      var reg = /(.*?)\.(xlsx)$/;
      if (!this.filename.match(reg)) {
        alert("Please Select Excel File!");
      } else {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, { type: "binary" });
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          var XL_row_object = XLSX.utils.sheet_to_json(worksheet, { raw: true });

          // this.http.post<any>("https://mobilehydraulics.boschrexroth.com/SPM/backend/SalesUnit/Salesunit_StockofSI.php", {data: XL_row_object, userdata: this.partner_registered_id})
          this.http.post<any>("https://mobilehydraulics.boschrexroth.com/SPM/backend/InserStockofSI.php", {data: XL_row_object},{headers: this.httpHeader})
            .subscribe((response: any) => {
              if (response.ok === true) {
                alert("File successfully added");
                this.ngOnInit();
              }
            });
          // this.router.navigate(['/customers']);

        }
        fileReader.readAsArrayBuffer(this.selectedMasterFile);
      }
    } else {
      alert("Please select an excel file!")
    }
    // const Uploaddata = new FormData();
    // Uploaddata.append('myFile', this.selectedMasterFile, this.selectedMasterFile.name);
    // this.http.post<any>("https://mobilehydraulics.boschrexroth.com/SPM/backend/Salesunit_StockofSI.php", Uploaddata).subscribe((res: any) => {
    //   if (res.ok === true) {
    //     alert(res.message)
    //   } else {
    //     alert(res.message)
    //   }
    // });
  }








}
