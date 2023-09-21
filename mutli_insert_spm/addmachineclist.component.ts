import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Router, ActivatedRoute } from '@angular/router';
import { ManagepagesService } from '../managepages.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { environment } from 'src/environments/environment';
declare var $: any;


import * as XLSX from 'xlsx';
import { LoginserviceService } from '../../loginservice.service';
declare var $: any;
@Component({
  selector: 'app-addmachineclist',
  templateUrl: './addmachineclist.component.html',
  styleUrls: ['./addmachineclist.component.scss']
})
export class AddmachineclistComponent implements OnInit {
  
  machinepagecontent: boolean = false;
  addmachine: any= FormGroup;
  industrysectors: any[] = [];
  application: any[] = [];
  filterproject: any[] = [];
  inlineeditt: boolean = false;
  updatedData: any[] = [];
  httpHeader: any;
  token: any;
  delete_machine_id: any;
  rowsPerPage: number = 10;
  actualPage: number = 1;
  showprevnext: boolean = false;
  endPaging: any;
  showProducts: any;
  countrecord: boolean = false;
  showmessage: string = "Please add machine.";
  projectname: string = '';
  message: any;
  expired: boolean = false;
  industry_sector_g1: any;
  industry_sector_g11: any;
  updateEditable: boolean = false;
  hideApplication: boolean = true;
industrysectorgroup1: any;
  hideMachine: boolean = false;
name: any;
// upload vars 
selectedMasterFile: any = File;
filename: any;
addexcelfiledata: any= FormGroup;
arrayBuffer:any;
tables: any[] = [];




  constructor(private getdata: AfterloginserviceService, private http: HttpClient, private formBuilder: FormBuilder, private breadcrumbService: BreadcrumbService, private router: Router, public ManagepagesService: ManagepagesService, private routes : ActivatedRoute) 
  {

    const routeParams = "/SPDashboard/Add_project/Add_Machine/"+this.routes.snapshot.paramMap.get('id');
    this.ManagepagesService.currenturl2(routeParams);

    this.getdata.userdata().forEach(element => {
      this.token = element.token;
     //this.token = localStorage.getItem('Token');
    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
  }
  userName: number = 0 ;
  nam: number = 0 ;
  ngOnInit(): void {

    // Get all Industry Sector
    this.http.get<any>(environment.baseurl + "GetIndustrySector.php?token="+ this.token).subscribe((res: any) =>{
        this.industrysectorgroup1  = res;
    });

    // Project Name
    this.http.get<any>(environment.baseurl + "currentprojectname.php?projectid="+this.routes.snapshot.paramMap.get('id')).subscribe((res: any) =>{
        this.projectname = res;
    });
    // Get Machine by Project_Id
    this.http.get<any>(environment.baseurl + "FilteredMachineByProject.php?projectid="+this.routes.snapshot.paramMap.get('id')+"&token="+this.token).subscribe((res: any) =>{
        this.filterproject = res;
        console.log(this.filterproject);
        if(this.filterproject.length > 0){
          this.filterproject = res;
          this.countrecord = false;
          this.pagination();
          this.updateViewAfterPaginationClicked();
        }else{
          this.countrecord = true;
        }
        // console.log(this.filterproject)
    });
    this.addmachine = this.formBuilder.group({
      machinename: ['', Validators.required],
      desc: ['', Validators.required],
      industrygroup1: ['', Validators.required],
      industry: ['', Validators.required],
      application: ['', Validators.required],
      phase: ['', Validators.required],
      project_id: this.routes.snapshot.paramMap.get('id')
    });

    this.breadcrumbService.set('@Machine', 'Machine List');
  }
  onmachine(){
    const routeParams = "/SPDashboard/Add_project/Add_Machine/"+this.routes.snapshot.paramMap.get('id');
    this.ManagepagesService.currenturl2(routeParams);
    this.ngOnInit();
  }
  // return current URL
  checkRouteUrl12() {
    const routeParams = "/SPDashboard/Add_project/Add_Machine/"+this.routes.snapshot.paramMap.get('id');
    this.ManagepagesService.currenturl2(routeParams);
    // this.ngOnInit();
    return this.router.url == "/SPDashboard/Add_project/Add_Machine/"+this.routes.snapshot.paramMap.get('id');
  }

  onchangeindustrysectorGroup(industrysectorgroup: any){ 
    this.application.length = 0;
    this.hideApplication = false;
    this.http.get<any>(environment.baseurl + "GetIndustrySector_Group2.php?industrygroup="+ industrysectorgroup+"&token="+this.token).subscribe((res: any) => {
      this.industrysectors = res;
    });
    
  }


  onchangeindustrysector(industrysector: any){
    this.hideMachine = true;
    // alert(industrysector)
    // this.application.length=0;
    // console.log(industrysector);
    // console.log('Hello');
    this.http.get<any>(environment.baseurl + "GetApplicationByIndustry.php?industry="+industrysector+"&token="+this.token).subscribe((res: any) =>{
        this.application = res;
        //  console.log(this.application);
    });
  }
  inlineedit(event: any){
    this.onchangeindustrysectorGroup(JSON.stringify(event["group1_id"]));
    this.onchangeindustrysector(JSON.stringify(event["group2_id"]));
    event.editable = true;
  }

  save(data: any){
    data.editable = false;
    this.updatedData.length = 0;
    this.updatedData.push({
      "machine_id": data.machine_id,
      "machine_name": data.machine_name,
      "description": data.machine_description,
      "machine_phase": data.machine_phase,
      "industry_sector_1": data.group1_id,
      "industry_sector": data.group2_id,
      "application": data.industry_sector_code
    });
    console.log(this.updatedData);
    this.http.post<any>(environment.baseurl + "UpdateMachineData.php", {data: this.updatedData}, {headers: this.httpHeader}).subscribe((res : any) =>{
        if(res.ok === true){
          this.message = res.message;
          $('#messagebox').moduleModal('open');
          this.ngOnInit();
        }else{
            this.expired = true;
            this.message = res.message;
            $('#messagebox').moduleModal('open');
            this.ngOnInit();
        }
    });
  }

  modalToOpen1(){
    $('#MultiEntry').moduleModal('open');
  }

  modalClose1(){
    $('#MultiEntry').moduleModal('close');
  }



  modalToOpen(){
    $('#addmachinemodel').moduleModal('open');
  }

  modalClose(){
    $('#addmachinemodel').moduleModal('close');
  }
  deletemodelopen(machineid: any){
    this.delete_machine_id = machineid;
    $('#opendeletemodel').moduleModal('open');
  }

  deletemodelclose(){
    $('#opendeletemodel').moduleModal('close');
    this.ngOnInit();
  }

  deletemessagebox(){
    $('#messagebox').moduleModal('close');
  }

  // Delete Materials
  DeleteMaterials(machineid: any){
    // alert(materialid);
    this.http.get<any>(environment.baseurl + 'DeleteMachine.php?machineid='+ machineid+"&token="+this.token).subscribe((res: any) => {
      // alert(res.message);
      this.deletemodelclose();
      this.ngOnInit();
    })
  }

  GoToMaterials(MachineId: any){
    // alert(MachineId)
   this.ManagepagesService.machinepagecontent = false;
   this.router.navigate(['/SPDashboard/Add_project/Add_Machine/',  this.routes.snapshot.paramMap.get('id') ,'Add_Material', MachineId ]);
  }
  // checkRouteUrl(){

  // }
  
  AddMachineData(){
    console.log(this.addmachine.value)

    this.http.post<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/addmachinedata.php", {data: this.addmachine.value}, {headers: this.httpHeader}).subscribe((res : any) =>{
        if(res.ok === true){
          this.message = res.message;
          $('#messagebox').moduleModal('open');
          this.modalClose();
          this.ngOnInit();
        }else{
            this.expired = true;
            this.message = res.message;
            $('#messagebox').moduleModal('open');
        }
    });
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

  submitForm(form: any) {
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetIndustrySector_Group1.php?technology="+form).subscribe((res: any) =>{
        this.industry_sector_g1 = res;
    });
  }
  submitTechnologyForm(application: any){
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetIndustrySector_Group11.php?application="+application).subscribe((res: any) =>{
        this.industry_sector_g11 = res;
    });
  }
  onchangeindustrysectorg1(isg1: any){
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetIndustrySector_Group2.php?isg1="+isg1).subscribe((res: any) =>{
        this.industrysectors = res;
        // console.log(this.industrysectors)
    });
  }

  close(data:any){
    data.editable=false;
    this.ngOnInit()
  }




  // select file and upload file
  
  incomingfile(event: any) {
    this.selectedMasterFile = event.target.files[0];
    this.filename = event.target.files[0].name;

  }
  
//   sendFiledata() {
//     if (this.filename != null) {
//       var reg = /(.*?)\.(xlsx)$/;
//       if (!this.filename.match(reg)) {
//         alert("Please Select Excel File!");
//       } else {
//         let fileReader = new FileReader();
//         fileReader.onload = (e) => {
//           this.arrayBuffer = fileReader.result;
//           var data = new Uint8Array(this.arrayBuffer);
//           var arr = new Array();
//           for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
//           var bstr = arr.join("");
//           var workbook = XLSX.read(bstr, { type: "binary" });
//           var first_sheet_name = workbook.SheetNames[0];
//           var worksheet = workbook.Sheets[first_sheet_name];
//           // const table = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//           // this.tables.push({ name: first_sheet_name, data: table });
// //  console.log(table)
//           var XL_row_object = XLSX.utils.sheet_to_json(worksheet, { raw: true });
// console.log(XL_row_object)
// console.log(this.httpHeader)

//           // this.http.post<any>(environment.suBaseUrl+"Salesunit_StockofSI.php", {data: XL_row_object, userdata: this.partner_registered_id})

//           this.http.post<any>(environment.baseurl+"MutiInsert.php", {data:"hello"})
//             .subscribe((response: any) => {
//               if (response.ok === true) {
//                 alert("File successfully added");
//                 this.ngOnInit();
//               }
//             });

//           // this.router.navigate(['/customers']);

//         }
//         fileReader.readAsArrayBuffer(this.selectedMasterFile);
//       }
//     } else {
//       alert("Please select an excel file!")
//     }
//     // const Uploaddata = new FormData();
//     // Uploaddata.append('myFile', this.selectedMasterFile, this.selectedMasterFile.name);
//     // this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/Salesunit_StockofSI.php", Uploaddata).subscribe((res: any) => {
//     //   if (res.ok === true) {
//     //     alert(res.message)
//     //   } else {
//     //     alert(res.message)
//     //   }
//     // });
//   }


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
        
 console.log(XL_row_object,"sheet")







 var json = JSON.stringify(XL_row_object)
 // console.log(json)
 // console.log(json[0][Decription])
 var data1 = JSON.parse(json)
 var tab =  []
 var tab1 = []
 var tab2 = []
 var tab3 = []
 var tab4 :any = [];
 
 
 
 let col = [ 'Machine Name', 'Decription','Industry_sector_1', 'Industry_sector_2','Application','Machine Phase', 'data','data1']
 
 // col = {'0': 'Machine Name','1': 'Decription','n': 'Industry_sector_1','3': 'Industry_sector_2','4': 'Application','5': 'Machine Phase','6': 'data','7': 'data1'}
   // console.log(col.length)
     console.log(data1.length)
 
 
 for ( let i = 0 ; i < 7 ;  i++){
   tab[i]  =data1[0][col[i]]  
   if (data1[3][col[i]] != undefined){
   tab1[i] = data1[3][col[i]]  
   }
 
     if (data1[7][col[i+1]] != undefined){
   tab2[i]  =data1[7][col[i+1]]  
 }
  if (data1[7][col[i+1]] != undefined){
   tab3[i]  =data1[7][col[i+1]]  
 }
   // console.log(i , j)
 // if(data1[j]["Machine Name"] ){
 //     console.log(j)
 
 //   tab4[j] = [];
 // for ( let z = 0  ; z < 8 ;  z++ ){
 //   tab4[j][z] = data1[j][col[z]]
 
 //         // console.log(z,col[z])
 
 //     // console.log(tab4)
 
 // }
 // //   tab4[i]= j
 // // tab4[i][j] = data1[j][i]
 // // console.log(data1[15]["data11"])
 // // j++
 // }
 }
 
 // var json1 = JSON.stringify(tab4)
 
 // console.log(json1)
 console.log("machine table : " , tab)
 console.log("years table : " , tab1)
 console.log("qty total table: " , tab2)
 console.log("qty rex table: " , tab3)
 
 
 
 // console.log(data1[15])
 // console.log(data1)
 for (let j = 15 , i = 0 ;j < data1.length ,i< (data1.length-15); j++, i++){
 
 if(data1[j]["Machine Name"] ){
    //  console.log(j)
      //  console.log(tab4,"1")
 
   tab4[i] = [];
      //  console.log(tab4,"2")
 
 for ( let z = 0  ; z < 8 ;  z++ ){
   tab4[i][z] = data1[j][col[z]]
       // console.log( j,z)
 
         // console.log(z,col[z])
 
 
 }
 //   tab4[i]= j
 // tab4[i][j] = data1[j][i]
 // console.log(data1[15]["data11"])
 // j++
 }
 }
 var json1 = JSON.stringify(tab4)
 console.log(json1)









 
//  console.log(this.httpHeader)

        // this.http.post<any>("https://mobilehydraulics.boschrexroth.com/SPM/backend/SalesUnit/Salesunit_StockofSI.php", {data: XL_row_object, userdata: this.partner_registered_id})
        this.http.post<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/MutiInsert.php", {data: tab, tab1 , tab2},{headers: this.httpHeader})
          .subscribe((response: any) => {
            // alert(response)
          
              console.log("machine insert input ", response);
              this.ngOnInit();
            
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



