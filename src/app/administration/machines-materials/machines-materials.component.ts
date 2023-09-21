import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from "../../solutionpartner/material/product";
import { DropdownModel } from "../../solutionpartner/material/dropdown-model";
import { SetbreadcrumbService } from 'src/app/countryunit/setbreadcrumb.service';
import { environment } from 'src/environments/environment';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';

declare var $: any;
@Component({
  selector: 'app-machines-materials',
  templateUrl: './machines-materials.component.html',
  styleUrls: ['./machines-materials.component.scss']
})
export class MachinesMaterialsComponent implements OnInit {

  AddMaterial: any = FormGroup;
  AddMateriallist: any = FormGroup;
  Material_list: any;
  // search: any;
  getprojectinformation: any[] = [];
  prototypedate: any;
  warning: boolean = false;

  // update
  fill_product: DropdownModel[] = [];
  selected_product: string = '';
  fill_model: DropdownModel[] = [];
  selected_model: string = '';
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

  rowsPerPage: number = 10;
  actualPage: number = 1;
  endPaging: any;
  // store data from 3D map
  updatedData: any[] = [];

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
  manual_product_family:any;
  breadcrumb_project_id: any;
  breadcrumb_machine_id: any;
  breadcrumb_partner_id: any;
  breadcrumbdata: any;

  showloader: boolean = true;
  machinename: string = '';
  message: any;
  insertedby3dmap: boolean = false;
  dataarr: any;
  requiredValids: any[] = [];
  submitted = false;
  projectdetails_submitted: boolean = false;
  breadcrumb_salesunit_id: any;

  py=new Date().getFullYear();
  currentYear: any = this.py;
  previousYear1 = this.currentYear - 1;
  previousYear2: any = this.previousYear1 - 1;
  futureYear1 = this.currentYear + 1;
  futureYear2: any = this.futureYear1 + 1;
  futureYear3 = this.futureYear2 + 1;
  httpHeader:any;
token:any;
  constructor( private getdata:BackendservicesService,private breadcrumb: SetbreadcrumbService, private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private routes: ActivatedRoute, ) {
    this.getdata.userdata().forEach(element => {
      this.token = element.token;
    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
   }

  ngOnInit(): void {

    // Breadcrumb
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/breadcrumb.php?machine_id=" + this.routes.snapshot.paramMap.get('machineid') + "&status=materialpage").subscribe((res: any) => {
      this.breadcrumbdata = res;
      this.breadcrumbdata.forEach((element: any) => {
        this.breadcrumb_partner_id = element.solutionpartner_registered_id;
        this.breadcrumb_project_id = element.project_id;
        this.breadcrumb_salesunit_id = element.country_unit_registred_id;
      });
    });

    // machine_name
    this.http.get<any>(environment.adminBaseUrl+"currentmachinename.php?machine_id=" + this.routes.snapshot.paramMap.get('machineid')+"&token="+this.token).subscribe((res: any) => {
      this.machinename = res;
      this.AddMaterial.patchValue(res);
    });

    this.http.get<any>(environment.adminBaseUrl + "GetProjectInfoByMachine.php?machine_id="+this.routes.snapshot.paramMap.get('machineid')+'&token='+this.token).subscribe((res: any) =>{
      this.getprojectinformation = res;
      if(this.getprojectinformation !== null){
        this.showmateriallist = true;
      }else{
        this.showmateriallist = false;
      }

      this.getprojectinformation.forEach(element => {
        this.prototypedate = element.prototype;
        this.AddMaterial.patchValue({
          model: element.model,
          experience: element.experience,
          prototype: element.prototype,
          sop: element.sop,
          eop: element.eop,
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

    this.http.get<any>(environment.adminBaseUrl+"FilteredMaterialByMachine.php?machines_id=" + this.routes.snapshot.paramMap.get('machineid')+"&token="+this.token).subscribe((res: any) => {
      this.Material_list = res;
    });

    this.AddMaterial = this.formBuilder.group({
      model: ['', Validators.required],
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

    $('.module-callout').moduleCallout();
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

  onclickMachine() {
    this.breadcrumb.onclickMachinedetails(this.breadcrumb_project_id);
  }

}
