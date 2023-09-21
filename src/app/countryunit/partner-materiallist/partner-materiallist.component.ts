import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Product } from "../../solutionpartner/material/product";
import { DropdownModel } from "../../solutionpartner/material/dropdown-model";
import { SetbreadcrumbService } from "../setbreadcrumb.service";
import { environment } from 'src/environments/environment';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-partner-materiallist',
  templateUrl: './partner-materiallist.component.html',
  styleUrls: ['./partner-materiallist.component.scss'],
  providers: [DatePipe]
})
export class PartnerMateriallistComponent implements OnInit {
  AddMaterial: any= FormGroup;
  Material_list: any;
  getprojectinformation: any[] = [];
  prototypedate: any;
  warning: boolean = false;
  showprevnext: boolean = false;
  showmateriallist: boolean = false;
  breadcrumb_project_id: any;
  breadcrumb_partner_id: any;
  breadcrumbdata: any;
  token: any;
  getcomname: boolean = true;
  py=new Date().getFullYear();
  currentYear: any = this.py;
  previousYear1 = this.currentYear - 1;
  previousYear2: any = this.previousYear1 - 1;
  futureYear1 = this.currentYear + 1;
  futureYear2: any = this.futureYear1 + 1;
  futureYear3 = this.futureYear2 + 1;

  constructor(public datepipe: DatePipe, private breadcrumb: SetbreadcrumbService, private http: HttpClient, private formBuilder: FormBuilder, private breadcrumbService: BreadcrumbService, private router: Router,  private routes : ActivatedRoute, private getdata: AfterloginserviceService) {
    this.getdata.userdata().forEach((element: any) => {
      this.token = element.token;
    });
  }

  ngOnInit(): void {
    // Breadcrumb
    this.http.get<any>(environment.baseurl + "breadcrumb.php?machine_id="+this.routes.snapshot.paramMap.get('machineid')+"&status=materialpage").subscribe((res: any) =>{
        this.breadcrumbdata = res;
        this.breadcrumbdata.forEach((element: any) => {
          this.breadcrumb_partner_id = element.solutionpartner_registered_id;
          this.breadcrumb_project_id = element.project_id;
        });
    });

    // machine_name
    this.http.get<any>(environment.baseurl + "currentmachinename.php?machine_id="+this.routes.snapshot.paramMap.get('machineid')).subscribe((res: any) =>{
        this.AddMaterial.patchValue(res);
    });

    this.http.get<any>(environment.baseurl + "Salesunit_GetProjectInfoByMachine.php?machine_id="+this.routes.snapshot.paramMap.get('machineid')+"&token="+this.token).subscribe((res: any) =>{
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
          prototype: this.datepipe.transform(element.prototype, 'dd/MM/yyyy'),
          sop: this.datepipe.transform(element.sop, 'dd/MM/yyyy'),
          eop: this.datepipe.transform(element.eop, 'dd/MM/yyyy'),
          mqty2019: element.previousyear2MachineQty,
          rexroth2019: element.previousyear2RexrothQty,
          mqty2020: element.previousyear1MachineQty,
          rexroth2020: element.previousyear1RexrothQty,
          mqty2021: element.presentyearMachineQty,
          rexroth2021: element.presentyearRexrothQty,
          mqty2022: element.futureyear1MachineQty,
          rexroth2022: element.featureyear1RexrothQty,
          mqty2023: element.futureyear2MachineQty,
          rexroth2023: element.featureyear2RexrothQty,
          mqty2024: element.futureyear3MachineQty,
          rexroth2024: element.featureyear3RexrothQty
        })
      });
    });

    this.http.get<any>(environment.baseurl +"Salesunit_FilteredMaterialByMachine.php?machines_id="+this.routes.snapshot.paramMap.get('machineid')+"&token="+this.token).subscribe((res: any) =>{
        this.Material_list = res;
    });
    this.AddMaterial = this.formBuilder.group({
      model: ['', Validators.required],
      experience: ['', Validators.required],
      prototype: ['', Validators.required],
      sop: ['', Validators.required],
      eop: [''],
      mqty2019: [''],
      rexroth2019: [''],
      mqty2020: [''],
      rexroth2020: [''],
      mqty2021: ['', Validators.required],
      rexroth2021: ['', Validators.required],
      mqty2022: [''],
      rexroth2022: [''],
      mqty2023: [''],
      rexroth2023: [''],
      mqty2024: [''],
      rexroth2024: [''],
      machine_id: this.routes.snapshot.paramMap.get('machineid')
    });

    $('.module-callout').moduleCallout();
  }

  prevnext(){
    this.showprevnext = true;
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

  checkmaterialstatus(materialdata: any){
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/checkmaterialstatus_materialpage.php", materialdata).subscribe((res: any) =>{
      if(res.ok === true){
        alert(res.message);
      }
    });
  }
}
