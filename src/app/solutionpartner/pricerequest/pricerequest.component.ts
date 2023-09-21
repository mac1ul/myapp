import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { environment } from 'src/environments/environment';
import { MaterialComponent } from '../material/material.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-pricerequest',
  templateUrl: './pricerequest.component.html',
  styleUrls: ['./pricerequest.component.scss']
})
export class PricerequestComponent implements OnInit {
  fasttrack: any[] = [];
  getdynamicdata: any;
  addFastTrackForm: any= FormGroup;
  public contactList: any = FormArray;
  arrayofvalues: any;
  getprojectmachine: any;
  token: any;
  Solution_Partner_id: any;
  email: any;
  user_id: any;
  httpHeader: any;
  materialID: any;
  py=new Date().getFullYear();
  currentYear: any = this.py;
  previousYear1 = this.currentYear - 1;
  previousYear2: any = this.previousYear1 - 1;
  futureYear1 = this.currentYear + 1;
  futureYear2: any = this.futureYear1 + 1;
  futureYear3 = this.futureYear2 + 1;
  constructor(private location:Location, private getdata: AfterloginserviceService, public materialcmp: MaterialComponent, private formBuilder: FormBuilder, private http: HttpClient, private router: Router,  private activatedroute : ActivatedRoute) {
    this.getdata.userdata().forEach(element => {
      this.token = element.token;
      this.Solution_Partner_id = element.company_registered_id;
      this.user_id = element.userID;
      //Newly Added email (by Jubayer Ahmed RIad)
      this.email = element.email;
      //console.log(this.email+"********");
    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
    // console.log(this.token + " " + this.Solution_Partner_id + " " + this.user_id);
  }

  ngOnInit(): void {
    let materialid: any = this.activatedroute.snapshot.queryParamMap.getAll('pdata');
    this.materialID = this.activatedroute.snapshot.queryParamMap.getAll('pdata');
    this.http.get<any>(environment.baseurl+"Fillprojectandmachineinfo.php?data="+materialid+"&token="+this.token).subscribe((res: any) =>{
      this.getprojectmachine = res;
      // console.log(this.getprojectmachine);
      this.getprojectmachine.forEach((element: any) => {
        this.addFastTrackForm.patchValue({
          partnername: element.partner_company_name,
          machinename: element.machine_name,
          projectname: element.project_name,
          application: element.application,
          //Newly Added contact_Person (by Jubayer Ahmed RIad)
          contact_person: this.email,
          q2021: element.machine_qty_current1,
          q2022: element.machine_qty_predict1,
          q2023: element.machine_qty_predict2,
          q2024: element.machine_qty_predict3
        })
      });
    });
    if(this.activatedroute.snapshot.queryParamMap.has('pdata')){
      // console.log(this.activatedroute.snapshot.queryParamMap.getAll('pdata') + " Keep user to current page ");
    }
    else{
      this.router.navigate(['/login']);
    }
    this.addFastTrackForm = this.formBuilder.group({
      id: ['', Validators.required],
      partnername: [{disabled: true}, Validators.required],
      machinename: [{disabled: true}, Validators.required],
      projectname: [{disabled: true}, Validators.required],
      application: [{disabled: true}, Validators.required],
      contact_person: ['', Validators.required],
      q2021: ['', Validators.required],
      q2022: ['', Validators.required],
      q2023: ['', Validators.required],
      q2024: ['', Validators.required],
      company_registered_id: this.Solution_Partner_id,
      contacts: this.formBuilder.array([this.createContact()])
    });
    this.fasttrack = this.activatedroute.snapshot.queryParamMap.getAll('pdata');
    this.http.get<any>(environment.baseurl+"FillPrototypeDelivery.php?data="+this.fasttrack+"&token="+this.token).subscribe((res: any) =>{
      this.getdynamicdata = res;

      console.log(this.getdynamicdata)
      this.addFastTrackForm.setControl('contacts', this.setexistingmat(this.getdynamicdata));
    });

    this.contactList = this.addFastTrackForm.get('contacts') as FormArray;
  }
  setexistingmat(ms: any): FormArray{
    const formarray = new FormArray([]);

    ms.forEach((element: any) => {
      formarray.push(this.formBuilder.group({
        material_id: element.material_id,
        part_number: element.part_number,
        description: element.description,
        nettpriceSI_unit1: element.qtypermachine,
        range_unit1: ['', Validators.required],
        competition_unit1: ['', Validators.required]
      }));
    });
    return formarray;
  }

  createContact(): FormGroup {
    return this.formBuilder.group({
      description: ['', Validators.required],
      part_number: ['', Validators.required],
      nettpriceSI_unit1: ['', Validators.required],
      range_unit1: ['', Validators.required],
      competition_unit1: ['', Validators.required]
    });
  }

  get contactFormGroup() {
    return this.addFastTrackForm.get('contacts') as FormArray;
  }

  addContact() {
    this.contactList.push(this.createContact());
  }
  removeContact(index: any) {
    this.contactList.removeAt(index);
  }
  SendPrototype(){
    // console.log(this.addFastTrackForm.value)
    this.http.post<any>(environment.baseurl+"AddPricerequest.php", { "material_id": this.fasttrack, "data": this.addFastTrackForm.value}, {headers: this.httpHeader}).subscribe((res: any) =>{
      if(res.ok === true){
        alert(res.message);
        this.Goback();
      }
    });
  }

  Goback(){
    this.materialcmp.td1.length=0;
    this.location.back();
    }
}
