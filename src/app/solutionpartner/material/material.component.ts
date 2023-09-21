import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ManagepagesService } from '../managepages.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from "../material/product";
import { DropdownModel } from "../material/dropdown-model";
declare var $: any;
import { filter } from 'rxjs/operators';
import { pairwise } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
import * as XLSX from 'xlsx';

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  httpHeader: any;

  previousUrl: string = '';
  currentUrl: string = '';
  Reach_At_Material: boolean = false;
  AddMaterial: any= FormGroup;
  AddMateriallist: any= FormGroup;
  Material_list: any;
  selectedRowIds: Set<number> = new Set<number>();
  selectedId: any = [];
  td1: any=[];
  checkedData:any;
  selectedpricereqdata: any;

  isfreeze:Boolean=false;
  isChecked:Boolean=false;
  // search: any;
  gettypecode: string = "";
  showyesbutton: boolean = false;
  getpartnumber: any;
  flag: number = 0;
  hidemsg: boolean = false;
  showfeedback: boolean = true;
  getpartnumberwithtime: any;
  getdeliverytime: any;
  getprojectinformation: any[] = [];
  prototypedate: any;
  currentdate: Date = new Date();
   localDate = this.currentdate.toLocaleDateString();
  warning: boolean = false;
  warnings: boolean = false;
  warning_delivery_time: any;
  iteration: any;

  // update
  fill_product: DropdownModel[] = [];
  selected_product: string = '';
  fill_model: DropdownModel[] = [];
  selected_model?: string = '' || 'no';
  fill_gotoexpress: DropdownModel[] = [];
  selected_gotoexpress: string = '';
  fill_product_family: DropdownModel[] = [];
  selected_product_family: string = '';
  fill_product_detailed: DropdownModel[] = [];
  selected_product_detailed: string = '';
  selected_material_number: string = '';
  selected_typecode: string = '';

  // 3D Model
  products: Product[] = [];
  productss: Product[] = [];
  showProducts: Product[] = [];
  anzahl: any;

  // Pagination Declaration
  rowsPerPage: number = 10;
  actualPage: number = 1;
  showprevnext: boolean = false;
  endPaging: any;
  // store data from 3D map
  updatedData: any[] = [];
  showDataAll :boolean = true

  editable: boolean = false;
  editdata: any[] = [];
  showmateriallist: boolean = false;
  delete_material_id: any;
  GetPF: any;

  showcompanydetails: boolean = false;
  showothersinput: boolean = false;
  product_id: any;

  manual_product: any;
  manual_product_detailed: any;
  manual_product_family: any;

  showproduct: boolean = false;
  machinename: string = '';
  callpage: boolean = false;

  showloader: boolean = true;
  // model
  message: any;
  insertedby3dmap: boolean = false;
  dataarr: any;
  requiredValids: any[] = [];
  submitted = false;
  projectdetails_submitted: boolean = false;
  token: any;
  getcomname: boolean = true;
  py=new Date().getFullYear();
  currentYear: any = this.py;
  previousYear1 = this.currentYear - 1;
  previousYear2: any = this.previousYear1 - 1;
  futureYear1 = this.currentYear + 1;
  futureYear2: any = this.futureYear1 + 1;
  futureYear3 = this.futureYear2 + 1;
  selected_typecodes: any;
  selected_partnumber: any;

  // Date format
  myInputFocus: boolean = false;
  myInputFocus1: boolean = false;
  myInputFocus2: boolean = false;
  myDate: any;
  endDate: any;
  prototypeDate: any;
  selected_industrysector1: string = '';
  selected_industrysector2: string = '';
  selected_application: string = '';
  group1: any;
  group2: any;
  sector_application: any;


  // upload vars 
selectedMasterFile: any = File;
filename: any;
addexcelfiledata: any= FormGroup;
arrayBuffer:any;
tables: any[] = [];


  constructor(private authservice: AuthenticationserviceService, private LoginserviceService: AfterloginserviceService, private cookieservice: CookieService, private http: HttpClient, private formBuilder: FormBuilder, private breadcrumbService: BreadcrumbService, public ManagepagesService: ManagepagesService, private router: Router,  private routes : ActivatedRoute) {
    const routeParams: string = this.router.url;
    if(routeParams.includes('Fast_track') || routeParams.includes('Price_Request')){
      this.callpage = true;
    }else{
      this.callpage = false;
    }
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
     this.previousUrl = this.currentUrl;
     this.currentUrl = event.url;
     if(routeParams == this.currentUrl && this.callpage === false){
      this.td1.length = 0;
      this.Reach_At_Material = true;
    }else{
      this.Reach_At_Material = false;
    }
    // console.log("Material Component TOken ->");
    this.LoginserviceService.userdata().forEach(element => {

      this.token = element.token;
    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
    // console.log(this.token)
  });
  }

  ngOnInit(): void {
    this.showDataAll=true
    this.td1.length=0
    // this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/checktokenduration.php?token="+this.token).subscribe((res : any) =>{
    //   if(res.ok === true){
    //     console.log(res.message)
    //   }else{
    //     this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/sessiondestroy.php").subscribe((res: any) =>{
    //       console.log('Your session is expired!');
    //     });
    //     localStorage.clear();
    //     this.cookieservice.deleteAll();
    //     sessionStorage.clear();
    //     alert(res.message)
    //     setTimeout(()=>{
    //       window.location.href = "https://p1.authz.bosch.com/auth/realms/dc/protocol/openid-connect/logout?post_logout_redirect_uri=https://mobilehydraulics.boschrexroth.com/spm_testversion3.0/Demo";
    //     },200)
    //     // this.authservice.authentication();
    //   }
    // });

    // new 3d map api
    this.http.post<any>(environment.baseurl+"iinitial_3dmapvalue.php", {product: "product"}, {headers: this.httpHeader}).subscribe((res : any) =>{
      this.fill_product = res;
    });
    this.http.post<any>(environment.baseurl+"iinitial_3dmapvalue.php", {s3d_model_available: "s3d"}, {headers: this.httpHeader}).subscribe((res : any) =>{
      this.fill_model = res;
      // console.log(this.fill_model)
    });
    this.http.post<any>(environment.baseurl+"iinitial_3dmapvalue.php", {goto_express: "gotoExpress"}, {headers: this.httpHeader}).subscribe((res : any) =>{
      this.fill_gotoexpress = res;
    });
    this.http.post<any>(environment.baseurl+"iinitial_3dmapvalue.php", {product_family: "productFamily"}, {headers: this.httpHeader}).subscribe((res : any) =>{
      this.fill_product_family = res;
    });
    this.http.post<any>(environment.baseurl+"iinitial_3dmapvalue.php", {product_detailed: "productdetailed"}, {headers: this.httpHeader}).subscribe((res : any) =>{
      this.fill_product_detailed = res;
    });
    this.http.get<any>(environment.baseurl + "GetIndustrySector.php?token="+ this.token).subscribe((res: any) =>{
      this.group1  = res;
    });

    this.http.get<any>(environment.baseurl+"Manual_product.php?&token="+this.token).subscribe((res: any) =>{
        this.manual_product = res;
       });
    // end

    this.http.get<any>(environment.baseurl+"currentmachinename.php?machine_id="+this.routes.snapshot.paramMap.get('machineid')+"&token="+this.token).subscribe((res: any) =>{
        this.machinename = res;
        this.AddMaterial.patchValue(res);
    });

    this.http.get<any>(environment.baseurl +"GetALLPF.php?token="+this.token).subscribe((res : any) =>{
      this.GetPF = res;
      // console.log(this.GetPF)
    });


    this.http.get<any>(environment.baseurl + "GetProjectInfoByMachine.php?machine_id="+this.routes.snapshot.paramMap.get('machineid')+'&token='+this.token).subscribe((res: any) =>{
      this.getprojectinformation = res;
      if(this.getprojectinformation !== null){
        this.showmateriallist = true;
      }else{
        this.showmateriallist = false;
      }
      // this.AddMaterial.patchValue(this.getprojectinformation);
      this.getprojectinformation.forEach(element => {
        this.prototypeDate = this.changeDateFormat(element.prototype);
        // console.log(this.prototypeDate)
        this.myDate = this.changeDateFormat1(element.sop);
        this.endDate = this.changeDateFormat2(element.eop);
        this.AddMaterial.patchValue({
          model: element.model,
          selectedapplication: element.selectedapplication,
          experience: element.experience,
          previousyear2MachineQty: element.previousyear2MachineQty,
          previousyear2RexrothQty: element.previousyear2RexrothQty,
          previousyear1MachineQty: element.previousyear1MachineQty,
          previousyear1RexrothQty: element.previousyear1RexrothQty,
          presentyearMachineQty: element.presentyearMachineQty,
          presentyearRexrothQty: element.presentyearRexrothQty,
          featureyear1RexrothQty: element.featureyear1RexrothQty,
          futureyear1MachineQty: element.futureyear1MachineQty,
          futureyear2MachineQty: element.futureyear2MachineQty,
          featureyear2RexrothQty: element.featureyear2RexrothQty,
          futureyear3MachineQty: element.futureyear3MachineQty,
          featureyear3RexrothQty: element.featureyear3RexrothQty
        })
      });
    });

    this.http.get<any>(environment.baseurl + "FilteredMaterialByMachine.php?machines_id="+this.routes.snapshot.paramMap.get('machineid')+'&token='+this.token).subscribe((res: any) =>{
        this.Material_list = res;

    });
    this.breadcrumbService.set('@Materials', 'Materials');

    this.AddMaterial = this.formBuilder.group({
      model: ['', Validators.required],
      selectedapplication: ['', Validators.required],
      experience: ['', Validators.required],
      prototype: ['', Validators.required],
      sop: ['', Validators.required],
      eop: [''],
      previousyear2MachineQty: [''],
      previousyear2RexrothQty: [''],
      previousyear1MachineQty: [''],
      previousyear1RexrothQty: [''],
      presentyearMachineQty: ['', Validators.required],
      presentyearRexrothQty: ['', Validators.required],
      futureyear1MachineQty: [''],
      featureyear1RexrothQty: [''],
      futureyear2MachineQty: [''],
      featureyear2RexrothQty: [''],
      futureyear3MachineQty: [''],
      featureyear3RexrothQty: [''],
      machine_id: this.routes.snapshot.paramMap.get('machineid')
    });

    // console.log(this.requiredValids);
    this.AddMateriallist = this.formBuilder.group({
      partnumber: ['', [Validators.required]],
      description: ['', [Validators.required]],
      supplier: ['', [Validators.required]],
      phase: ['null',  this.requiredValids.includes('phase') ? [Validators.required] : []],
      qtypermachine: ['', [Validators.required]],
      othersupplier: ['Other Supplier Name', this.requiredValids.includes('othersupplier') ? [Validators.required] : []],
      product: ['null', this.requiredValids.includes('product') ? [Validators.required] : []],
      productdetailed: ['null', this.requiredValids.includes('productdetailed') ? [Validators.required] : []],
      machine_id: this.routes.snapshot.paramMap.get('machineid')
    });
    $('.module-callout').moduleCallout();
    this.pagination();
  }

  onchangeindustrysectorGroup1(industrysectorgroup: any){
    this.selected_industrysector2 = '';
    this.selected_application = '';
    this.http.get<any>(environment.baseurl + "GetIndustrySector_Group2.php?industrygroup="+ industrysectorgroup+"&token="+this.token).subscribe((res: any) => {
      this.group2 = res;
    });
  }

  onchangeindustrysectorGroup2(industrysectorgroup2: any){
    this.selected_application = '';
    this.http.get<any>(environment.baseurl + "GetApplicationByIndustry.php?industry="+industrysectorgroup2+"&token="+this.token).subscribe((res: any) =>{
        this.sector_application = res;
    });
  }

  changeDateFormat(date: any){
    if(date.length >= 5){
      this.myInputFocus = !this.myInputFocus;
    }
    this.prototypeDate = date.split('-').reverse().join("-")
    return this.prototypeDate
  }
  changeDateFormat1(date: any){
    if(date.length >= 5){
      this.myInputFocus1 = !this.myInputFocus1;
    }
    this.myDate = date.split('-').reverse().join("-")
    return this.myDate
  }
  changeDateFormat2(date: any){
    if(date.length >= 5){
      this.myInputFocus2 = !this.myInputFocus2;
    }
    this.endDate = date.split('-').reverse().join("-")
    return this.endDate
  }

  get f()
  {
    return this.AddMateriallist.controls;
  }

  get projectDetails()
  {
    return this.AddMaterial.controls;
  }
  onchangeproduct(product: any){
    this.selected_product_detailed = '';
    this.selected_product_family = '';
    const products = product.replace(/\s/g, "");
    this.http.get<any>(environment.baseurl+"manual_product_detailed.php?product="+product+"&token="+this.token).subscribe((res: any) =>{
        this.manual_product_detailed = res;
    });
  }

  filterPF(pd: any)
  {
    this.selected_product_family = '';
    this.http.get<any>(environment.baseurl+"manual_product_family.php?product_family="+pd+"&token="+this.token).subscribe((res: any) =>{
        this.manual_product_family = res;
    });
  }

  editmaterial(editrequest: any, getcominfo: any){
    if(getcominfo == "Bosch Rexroth"){

      this.getcomname = true;
    }else{
      this.getcomname = false;
    }
    editrequest.editable = true;
    this.warning = true;
  }
  save(data: any){
    this.warning = false;
    data.editable = false;
    // console.log(data);
    this.editdata.length = 0;
    this.editdata.push({
      "material_id": data.material_id,
      "part_number": data.part_number,
      "description": data.description,
      // "product_family": data.product_family,
      // "quick_delivery_time": data.quick_delivery_time,
      // "supplier": data.supplier,
      // "material_phase": data.material_phase,
      "qtypermachine": data.qtypermachine,
      // "product": data.product,
      "commentt":data.commentt
      // "product_detailed": data.product_detailed
    });
    // console.log(this.updatedData);
    this.http.post<any>(environment.baseurl+"UpdateMaterialsData.php", {data: this.editdata},{headers:this.httpHeader}).subscribe((res : any) =>{
        if(res.ok == true){
          this.message = res.message;
          this.warning = false;
          this.myInputFocus = false;
          this.myInputFocus1 = false;
          this.myInputFocus2 = false;
          $('#messagebox').moduleModal('open');
          this.endDate = "";
          this.myDate = "";
          this.prototypeDate = "";
        }else{
          this.message = res.message;
          $('#messagebox').moduleModal('open');
          this.ngOnInit();
        }
    });
  }
  AddMachineDetails(){
    // console.log(this.AddMaterial.value)
    this.projectdetails_submitted = true;
    if (this.AddMaterial.invalid) {
      return;
    }
    this.http.post<any>(environment.baseurl + "addprojectdetails.php", {data: this.AddMaterial.value}, {headers: this.httpHeader}).subscribe((res : any) =>{
        if(res.ok == true){
          this.message = res.message;
          this.myInputFocus = false;
          this.myInputFocus1 = false;
          this.myInputFocus2 = false;
          alert(this.message)
          this.endDate = "";
          this.myDate = "";
          this.prototypeDate = "";
          // $('#messagebox').moduleModal('open');
          this.showmateriallist = true;
          this.ngOnInit();
        }else{
          this.message = res.message;
          $('#messagebox').moduleModal('open');
          this.showmateriallist = false;
          this.ngOnInit();
        }
    });
  }



  modalToOpen1(){
    $('#uploadmodule').moduleModal('open');
  }

  modalClose1(){
    $('#uploadmodule').moduleModal('close');
  }

  // deletemodelopen(machineid: any){
  //   this.delete_machine_id = machineid;
  //   $('#opendeletemodel').moduleModal('open');
  // }
  // deletemodelclose(){
  //   $('#opendeletemodel').moduleModal('close');
  //   this.ngOnInit();
  // }
  
  deletemessagebox1(){
    $('#messagebox').moduleModal('close');
  }
  deletemodelclose1(){
    $('#opendeletemodel').moduleModal('close');
    $('#messagebox').moduleModal('close');
    this.ngOnInit();
  }
  downloadFile(){
    const link = document.createElement('a');
    link.setAttribute('target', '_self');
    link.setAttribute('href', environment.baseurl+'//adding_machines.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }







  modalToOpen(){
    $('#addmaterial').moduleModal('open');

  }

  modalToOpen2(){
    $('#3dmodels').moduleModal('open');
  }

  modalClose(){
   $('#addmaterial').moduleModal('close');
  }


  modalClose2(){
    $('#3dmodels').moduleModal('close');
  }

  deletemodelopen(materialid: any){
    this.delete_material_id = materialid;
    $('#opendeletemodel').moduleModal('open');
  }

  deletemodelclose(){
    $('#opendeletemodel').moduleModal('close');
    $('#messagebox').moduleModal('close');
    this.ngOnInit();
  }

  AddProjectMachindetails(){
    // console.log(this.AddMateriallist.value);
    this.submitted = true;
    // stop here if form is invalid
    if (this.AddMateriallist.invalid) {
      return;
    }

    this.http.post<any>(environment.baseurl+"addprojectmaterials.php", {data: this.AddMateriallist.value},{headers: this.httpHeader}).subscribe((res : any) =>{
        if(res.ok === true){
          this.message = res.message;
          this.myInputFocus = false;
          this.myInputFocus1 = false;
          this.myInputFocus2 = false;
          $('#messagebox').moduleModal('open');
          this.modalClose();
          this.endDate = "";
          this.myDate = "";
          this.prototypeDate = "";
        }else{
          this.message = res.message;
          $('#messagebox').moduleModal('open');
          this.modalClose();
          this.ngOnInit();
        }
    });
  }

  GoToFastTrack(){
    this.Reach_At_Material = false;
    this.router.navigate([this.router.url, 'Fast_track']);
  }

  rowIsSelected(id: number) {
    if(this.td1.includes(id)){
      this.td1.forEach((element: any, index: any) => {
        if(element == id){
          this.td1.splice(index, 1);
        }
      });
    }else{
      this.td1.push(id);
    }

    console.log(this.td1)
  }
  gotofasttrack() {
    if(this.td1.length > 0){
      this.router.navigate([this.router.url, 'Fast_track'], {
        queryParams: {
          data: this.td1
        }
      });
    }else{
      alert("Please select materials from the Material List.")
    }
  }

  emptyfatsttract(){
    this.td1.pop()
  }

  // check freeze check start

  checkFreeze(data:any){
    let id = data.machine_id
    this.http.post<any>(environment.baseurl+"toggleFreezeMaterial.php", {data: data.material_id},{headers: this.httpHeader}).subscribe((res : any) =>{
      if(res.ok === true){
        console.log('data update',res.message)
        this.myInputFocus = false;
        this.myInputFocus1 = false;
        this.myInputFocus2 = false;
        this.endDate = "";
        this.myDate = "";
        this.prototypeDate = "";
        this.ngOnInit()
      }else{
        data.isfreeze = false
      }
    });
  }



    // check freeze check end

  gotopricerequest(){
    if(this.td1.length > 0){
      this.router.navigate([this.router.url, 'Price_Request'], {
        queryParams: {
          pdata: this.td1
        }
      });
    }else{
      alert("Please select materials from the Material List.")
    }
  }
  onProducts(objects: any){
    if(objects.tabelle != null){
      this.products = objects.tabelle;
      // this.product2 = objects.product;
      // this.series2 = objects.series;
      // this.s3d_model_available2 = objects.s3d_model_available;
      // this.single_tandem2 = objects.single_tandem;
      // this.size_ccm2 = objects.size_ccm;
      // this.goto_express2 = objects.goto_express;

      this.anzahl = this.products.length;
      // document.getElementById('counter').innerHTML = anzahl.toString();

    }
  }
  LoadtoSPM(data: Product, status: any) {
    if(this.updatedData.indexOf(data.material_number) === -1 && status.target.checked === true)
    {
      this.updatedData.push(data);
    }
    else if(status.target.checked === false)
    {
        let index = this.updatedData.indexOf(data);
        this.updatedData.splice(index, 1);
    }
    // this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/UpdateMachineData.php", {data: this.updatedData}).subscribe((res : any) =>{
    //     if(res !== null){
    //       alert(res.message);
    //     }
    // });
  }
  save3dmap(){
    if(this.updatedData.length > 0){
      this.http.post<any>(environment.baseurl+"search.php", {data: this.updatedData, machine_id: this.routes.snapshot.paramMap.get('machineid')}).subscribe((res : any) =>{
        this.dataarr = res;
        if(this.dataarr.length > 0){
          this.insertedby3dmap = true;
          $('#messagebox').moduleModal('open');
          this.productss.length = 0;
          this.updatedData.length = 0;
          this.myInputFocus = false;
          this.myInputFocus1 = false;
          this.myInputFocus2 = false;
          this.modalClose2();
          this.endDate = "";
          this.myDate = "";
          this.prototypeDate = "";
        }else{
          this.modalClose2();
          this.ngOnInit();
        }
    });
    }else{
      alert("Please select products from list")
    }
  }

  // Delete Materials
  DeleteMaterials(materialid: any){
    console.log(materialid)
    // alert(materialid);
    this.http.get<any>(environment.baseurl+'DeleteMaterials.php?materialid='+ materialid+'&token='+this.token).subscribe((res: any) => {
      // alert(res.message);
      this.myInputFocus = false;
      this.myInputFocus1 = false;
      this.myInputFocus2 = false;
      this.deletemodelclose();
      this.endDate = "";
      this.myDate = "";
      this.prototypeDate = "";
    })
  }

  // 3d map update code
  selectedvalues(){
    this.showloader = false;
    if(this.selected_product != ""){
      // this.selected_product_detailed = '';
      // this.selected_product_family = '';
      var name: any = "products";
    }
    if(this.selected_product_detailed != ""){
      // this.selected_product_family = '';
      var name: any = "productdetailed";
    }
    if(this.selected_product_family != ""){
      var name: any = "profuctf";
    }
    if(this.selected_model != ""){
      var name: any = "models";
    }
    if(this.selected_industrysector1 != ""){
      var name: any = "industrysectorsearch";
    }
    if(this.selected_industrysector2 != ""){
      var name: any = "industrysectorsearch1";
    }
    if(this.selected_application != ""){
      var name: any = "applicationsearch";
    }
    if(this.selected_gotoexpress != ""){
      var name: any = "gotoe";
    }
    this.http.post<Product>(environment.baseurl + "3dmap_filterselectedvalue.php", {
      product: this.selected_product,
      s3d_model_available: this.selected_model,
      goto_express: this.selected_gotoexpress,
      product_family: this.selected_product_family,
      product_detailed: this.selected_product_detailed,
      industrysector1: this.selected_industrysector1,
      industrysector2: this.selected_industrysector2,
      application: this.selected_application,
      material_number: this.selected_partnumber,
      typecode: this.selected_typecodes
    }).subscribe((res: Product) =>{
      this.assignedvalue(res, name);
      this.showloader = true;
    });
    // if(name === 'products'){
    //   this.selected_product_detailed = '';
    //   this.selected_product_family = '';
    //   this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
    //   product: this.selected_product,
    //   s3d_model_available: this.selected_model,
    //   goto_express: this.selected_gotoexpress,
    //   product_family: '',
    //   product_detailed: '',
    //   industrysector1: this.selected_industrysector1,
    //   industrysector2: this.selected_industrysector2,
    //   application: this.selected_application
    // }).subscribe((res: Product) =>{
    //   this.assignedvalue(res, name);
    //   this.showloader = true;
    // });
    // } else if(name == 'productdetailed'){
    //   this.selected_product_family = '';
    //   this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
    //   product: this.selected_product,
    //   s3d_model_available: this.selected_model,
    //   goto_express: this.selected_gotoexpress,
    //   product_family: '',
    //   product_detailed: this.selected_product_detailed,
    //   industrysector1: this.selected_industrysector1,
    //   industrysector2: this.selected_industrysector2,
    //   application: this.selected_application
    // }).subscribe((res: Product) =>{
    //   this.assignedvalue(res, name);
    //   this.showloader = true;
    // });
    // }else if(name == 'profuctf'){
    //   this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
    //   product: this.selected_product,
    //   s3d_model_available: this.selected_model,
    //   goto_express: this.selected_gotoexpress,
    //   product_family: this.selected_product_family,
    //   product_detailed: this.selected_product_detailed,
    //   industrysector1: this.selected_industrysector1,
    //   industrysector2: this.selected_industrysector2,
    //   application: this.selected_application
    // }).subscribe((res: Product) =>{
    //   this.assignedvalue(res, name);
    //   this.showloader = true;
    // });
    // }else if(name == "models" || name == "gotoe"){
    //   this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
    //   product: this.selected_product,
    //   s3d_model_available: this.selected_model,
    //   goto_express: this.selected_gotoexpress,
    //   product_family: this.selected_product_family,
    //   product_detailed: this.selected_product_detailed,
    //   industrysector1: this.selected_industrysector1,
    //   industrysector2: this.selected_industrysector2,
    //   application: this.selected_application
    // }).subscribe((res: Product) =>{
    //   this.assignedvalue(res, name);
    //   this.showloader = true;
    // });
    // }else if(name == "industrysectorsearch"){
    //   this.http.post<Product>(environment.baseurl + "3dmap_filterselectedvalue.php", {
    //     product: this.selected_product,
    //     s3d_model_available: this.selected_model,
    //     goto_express: this.selected_gotoexpress,
    //     product_family: this.selected_product_family,
    //     product_detailed: this.selected_product_detailed,
    //     industrysector1: this.selected_industrysector1
    //   }).subscribe((res: Product) =>{
    //     this.assignedvalue(res, name);
    //     this.showloader = true;
    //   });
    // }else if(name == "industrysectorsearch1"){
    //   this.http.post<Product>(environment.baseurl + "3dmap_filterselectedvalue.php", {
    //     product: this.selected_product,
    //     s3d_model_available: this.selected_model,
    //     goto_express: this.selected_gotoexpress,
    //     product_family: this.selected_product_family,
    //     product_detailed: this.selected_product_detailed,
    //     industrysector1: this.selected_industrysector1,
    //     industrysector2: this.selected_industrysector2
    //   }).subscribe((res: Product) =>{
    //     this.assignedvalue(res, name);
    //     this.showloader = true;
    //   });
    // }else if(name == "applicationsearch"){
    //   this.http.post<Product>(environment.baseurl + "3dmap_filterselectedvalue.php", {
    //     product: this.selected_product,
    //     s3d_model_available: this.selected_model,
    //     goto_express: this.selected_gotoexpress,
    //     product_family: this.selected_product_family,
    //     product_detailed: this.selected_product_detailed,
    //     industrysector1: this.selected_industrysector1,
    //     industrysector2: this.selected_industrysector2,
    //     application: this.selected_application
    //   }).subscribe((res: Product) =>{
    //     this.assignedvalue(res, name);
    //     this.showloader = true;
    //   });
    // }
  }
  // selectedvalues(name: any){
  //   this.showloader = false;
  //   if(name === 'products'){
  //     this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
  //     product: this.selected_product,
  //     s3d_model_available: this.selected_model,
  //     goto_express: this.selected_gotoexpress,
  //     product_family: '',
  //     product_detailed: ''
  //   }).subscribe((res: Product) =>{
  //     this.assignedvalue(res, name);
  //   });
  //   } else if(name == 'productdetailed'){
  //     this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
  //     product: this.selected_product,
  //     s3d_model_available: this.selected_model,
  //     goto_express: this.selected_gotoexpress,
  //     product_family: '',
  //     product_detailed: this.selected_product_detailed
  //   }).subscribe((res: Product) =>{
  //     this.assignedvalue(res, name);
  //   });
  //   }else if(name == 'profuctf'){
  //     this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
  //     product: this.selected_product,
  //     s3d_model_available: this.selected_model,
  //     goto_express: this.selected_gotoexpress,
  //     product_family: this.selected_product_family,
  //     product_detailed: this.selected_product_detailed
  //   }).subscribe((res: Product) =>{
  //     this.assignedvalue(res, name);
  //   });
  //   }else if(name == "models" || name == "gotoe"){
  //     this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
  //     product: this.selected_product,
  //     s3d_model_available: this.selected_model,
  //     goto_express: this.selected_gotoexpress,
  //     product_family: this.selected_product_family,
  //     product_detailed: this.selected_product_detailed
  //   }).subscribe((res: Product) =>{
  //     this.assignedvalue(res, name);
  //   });
  //   }
  // }
  dynamic_search(material_number: any, call: any){
    if(material_number.length == 0){
      alert('please enter material number or typecode');
    }else{
      if(this.selected_partnumber != null || this.selected_typecodes != null){
        this.http.get<any>(environment.baseurl + "3Dmap_searchbypartnumberandtypecode.php?partnumber="+this.selected_partnumber+"&typecode="+this.selected_typecodes+"&token="+this.token+"&threedModel="+this.selected_model).subscribe((res: any) =>{
          this.showProducts = res;
        });
      }else{
        if(call == 'partnumber'){
          this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3Dmap_searchbypartnumber.php?keyword="+material_number+"&status="+call).subscribe((res: any) =>{
            this.showProducts = res;
          });
        }else{
          this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3Dmap_searchbypartnumber.php?keyword="+material_number+"&status="+call).subscribe((res: any) =>{
            this.showProducts = res;
          });
        }
      }
    }
  }

  search(material_number: any, call: any){
    if(material_number.length == 0){
      alert('please enter material number or typecode');
    }else{
      if(call == 'partnumber'){
        alert(material_number)
        this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
        product: '',
        s3d_model_available: '',
        goto_express: '',
        product_family: '',
        product_detailed: '',
        material_number: material_number,
        typecode: ''
      }).subscribe((res: Product) =>{
        this.assignedvalue(res, name);
        this.showloader = true;
      });
      }else{
        this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
        product: '',
        s3d_model_available: '',
        goto_express: '',
        product_family: '',
        product_detailed: '',
        typecode: material_number,
        material_number: ''
      }).subscribe((res: Product) =>{
        this.assignedvalue(res, name);
        this.showloader = true;
      });
      }
    }
  }
  assignedvalue(objects: any, name: any){
    if(name == "products"){
      this.fill_product_detailed = objects.product_detailed;
      this.fill_product_family = objects.product_family;
      this.productss = objects.data;
    }
    if(name == "productdetailed"){
      this.fill_product_family = objects.product_family;
      this.productss = objects.data;
    }
    this.productss = objects.data;
    // console.log(this.productss)
    this.productss.forEach((element: any) => {
      if(element.nofound == true){
        this.showloader = true;
        alert("No addition data found!")
      }
    });
    this.pagination();
    this.updateViewAfterPaginationClicked();
    this.anzahl = this.productss.length;
  }
  master_search(){
    alert("search now");
  }

  // Pagination
  pagination() {
    if (this.productss.length % this.rowsPerPage != 0) {
      this.endPaging = Math.round(this.productss.length / this.rowsPerPage)
    } else {
      this.endPaging = this.productss.length / this.rowsPerPage
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
    this.showProducts = this.productss.slice(start, end);
  }

  prevnext(){
    this.showprevnext = true;
  }
  selectedOption(company: any){
    if(company === "Bosch Rexroth"){
      this.showcompanydetails = true;
      this.showothersinput = false;
      this.requiredValids = ['phase', 'product', 'productdetailed'];
    }else{
      this.requiredValids = ['othersupplier'];
      this.showothersinput = true;
      this.showcompanydetails = false;
    }
  }

  onmaterials(){
    // this.ManagepagesService.onmaterialpage(this.currentUrl)
    this.Reach_At_Material = true;
    this.td1.length = 0;
  }

  checkmaterialstatus(materialdata: any){
    this.http.post<any>(environment.baseurl+"checkmaterialstatus_materialpage.php", materialdata,{headers: this.httpHeader}).subscribe((res: any) =>{
      if(res.ok === true){
        alert(res.message);
      }
    });
  }
  resetForm(){
    this.selected_product = '';
    this.selected_model = 'no';
    this.selected_gotoexpress = '';
    this.selected_product_family = '';
    this.selected_product_detailed = '';
    this.selected_material_number = '';
    this.selected_typecodes = '';
    this.selected_partnumber = '';
    this.selected_industrysector1 = '';
    this.selected_industrysector2 = '';
    this.selected_application = '';
  }

  DataSheet(typecode: any){
    var typecode = typecode.replace(/\s/g, "");
    let cutcharacter: any = typecode.substring(0, 3);

    var match: any     = cutcharacter.match(/[a, A]/gi);
    var lastIndex  = cutcharacter.lastIndexOf(match[match.length-1]);
    var lastIndex = lastIndex;
    // alert(lastIndex)
    // const spilitchar = "/";
    // if(typecode.includes(spilitchar)){
      var splitted = typecode.split("/", 2);
      var find = splitted[0];

      let productfamily: any = find.substring(lastIndex, )
      // alert(productfamily)

      let skipcharacter: any = lastIndex + 3;
      // alert(skipcharacter)

      let cutrestoftc: any = find.substring(skipcharacter, )
      // alert(cutrestoftc)

      var matchnumber: any     = cutrestoftc.match(/[0-9]/gi);
      var firstIndex  = cutrestoftc.indexOf(matchnumber[0]);
      // alert(firstIndex)
      var firstIndex: any = firstIndex + skipcharacter;
      // alert(firstIndex)
      let finalpf: any = find.substring(lastIndex, firstIndex)
      if(finalpf == "A17FM"){
        finalpf = "A17F";
      }else if(finalpf == "A18FDO"){
        finalpf = "A18F";
      }else if(finalpf == "A20VG"){
        finalpf = "A20V";
      }else if(finalpf == "AXIALKOLBENPUMPEAA4"){
        finalpf = "A4VG";
      }else if(finalpf == "A2FMN" || finalpf == "A2FMM"){
        finalpf = "A2FM";
      }else if(finalpf == "A2FEN"){
        finalpf = "A2FE";
      }else if(finalpf == "A2FLM"){
        finalpf = "A2F";
      }else if(finalpf == "A10VEC"){
        finalpf = "A10VE";
      }else if(finalpf == "A10CO"){
        finalpf = "A10";
      }else if(finalpf == "A20VLO" || finalpf == "A20VNO"){
        finalpf = "A20V";
      }else if(finalpf == "A4VSH" || finalpf == "A20VNO" || finalpf == "A4VSE" || finalpf == "AA4VSE"){
        finalpf = "A4V";
      }else if(finalpf == "A7V-SL" || finalpf == "A7VLO"){
        finalpf = "A7V";
      }else if(finalpf == "A7VKG" || finalpf == "A7VKO"){
        finalpf = "A7VK";
      }else if(finalpf == "A2VK"){
        finalpf = "A2V";
      }else if(finalpf == "A2P-SL" || finalpf == "A2P"){
        finalpf = "PA2";
      }else if(finalpf == "A7FO" || finalpf == "A2FOM"){
        finalpf = "A7F";
      }else if(finalpf == "A2FOM" || finalpf == "A2FLO" || finalpf == "A2FLM" || finalpf == "A2FK" || finalpf == "A2FEM" || finalpf == "A2FLE"){
        finalpf = "A2F";
      }else if(finalpf == "A10VEC"){
        finalpf = "A10VE";
      }else if(finalpf == "A10VT"){
        finalpf = "A10";
      }else if(finalpf == "A6VLM"){
        finalpf = "A6V";
      }else{
        finalpf = finalpf;
      }
      window.open("https://www.boschrexroth.com/en/us/home/search?lang=EN&origin=header&s=download&getfields=Search%252Edc_filename.Search_dc_asset_identifier.Search%252Edc_prd_grp.Search%252Edc_mediatype.Search%252Edc_filetype.Search%252Edc_title_en.Search%252Edc_subtitle_en.Search_dc_description_en.Search_dc_document_status.Search%252Edc_asset_version_identifier.Search%252Edc_subtitle_en.Search%252Edc_title_en.Search_dc_description_en&dnavs=DC_mediatype%3Adc_media_type_data_sheet&q="+finalpf, "_blank");
  }
  requestThreeDModel(){
    alert("We will update it soon.")
  }




  
  incomingfile(event: any) {
    this.selectedMasterFile = event.target.files[0];
    this.filename = event.target.files[0].name;

  }
  
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
//  var tab4 =[]
 var tab4 :any = [];

 var tab5 =[]
 var counter = 0 
 let col = [ 'row1', 'row2','row3', 'row4','row5','row6','row7','row8'];
   for (let j =15  ;j < data1.length ;j++){
         if(data1[j]["row1"] ){
           counter++
 }
   }
       console.log(counter)
 
 //   for (let j =15 ,  i =0  ;j < data.length , i < counter ;i++, j++){
 //     if(data[j]["row1"] ){
 //       tab5[i] = data[j]
          
           
 // }
 // }
 
 
   for (let j =15 , i =0;j < data1.length ,i< counter; j++, i++){
   
   if(data1[j]["row1"] ){
       // console.log(j)
        //  console.log(tab4,"1")
   
     tab4[i] = {};
        //  console.log(tab4,"2")
   
   for ( let z = 0  ; z < 8 ;  z++ ){
     tab4[i][col[z]] = data1[j][col[z]]
         // console.log( j,z)
   
           // console.log(z,col[z])
   
   }
  
   }
   }
 
 // console.log(data[3]["data"])
 console.log(tab4)
















//  var tab4 :any = [];
//  var counter = 0 

//  var json = JSON.stringify(XL_row_object)
//  // console.log(json)
//  // console.log(json[0][Decription])
//  var data1 = JSON.parse(json)
 
 
 
 
//  let col = [ 'row1', 'row2','row3', 'row4','row5','row6','row7','row8'];

//  for (let j =15  ;j < data.length ;j++){
//   if(data1[j]["row1"] ){
//     counter++
// }
// }
// console.log(counter);



//   for (let j = 0 , i = 0 ;j < data1.length ,i< counter; j++, i++){
  
//   if(data1[j]["row1"] ){
//      //  console.log(j)
//        //  console.log(tab4,"1")
  
//     tab4[i] = {};
//        //  console.log(tab4,"2")
  
//   for ( let z = 0  ; z < 8 ;  z++ ){
//     tab4[i][col[z]] = data1[j][col[z]]
  
  
//   }
 
//   }
//   }

//    console.log(this.routes.snapshot.paramMap.get('id'))
//     console.log(tab4)
 
//     console.log(this.httpHeader)





    this.http.post<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/AddMachineByExcel.php", {data: tab4,project_id:this.routes.snapshot.paramMap.get('id')} ,{headers: this.httpHeader})
    .subscribe((response: any) => {
    
        
        console.log(response);
  
      this.ngOnInit();
      
    });


 

      }
      fileReader.readAsArrayBuffer(this.selectedMasterFile);
    }
  } else {
    alert("Please select an excel file!")
  }

}

  









}
