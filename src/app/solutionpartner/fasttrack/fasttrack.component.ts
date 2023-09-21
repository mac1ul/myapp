import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { ManagepagesService } from '../managepages.service';
import { environment } from 'src/environments/environment';
import { MaterialComponent } from '../material/material.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-fasttrack',
  templateUrl: './fasttrack.component.html',
  styleUrls: ['./fasttrack.component.scss']
})
export class FasttrackComponent implements OnInit {
  edit: boolean=false;
  fasttrack: any[] = [];
  getdynamicdata: any;
  addFastTrackForm: any= FormGroup;
  public contactList: any = FormArray;
  arrayofvalues: any;
  getprojectmachine: any;
  token: any;
  Solution_Partner_id: any;
  user_id: any;
  email: any;
  httpHeader: any;
  materialid:any=null;
  submitted = false;
  MaterialComponent: any;
  constructor( private location:Location,public materialcmp: MaterialComponent , public ManagepagesService: ManagepagesService, private getdata: AfterloginserviceService, private formBuilder: FormBuilder, private http: HttpClient, private router: Router,  private activatedroute : ActivatedRoute) {
    this.getdata.userdata().forEach(element => {
      this.token = element.token;
      this.Solution_Partner_id = element.company_registered_id;
      this.user_id = element.userID;
    });

    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
  }

  ngOnInit(): void {

    this.materialid = this.activatedroute.snapshot.queryParamMap.getAll('data');
    this.http.get<any>(environment.baseurl+"Fillprojectandmachineinfo.php?data="+this.materialid+"&token="+this.token).subscribe((res: any) =>{
      this.getprojectmachine = res;
      this.getprojectmachine.forEach((element: any) => { 
        this.addFastTrackForm.patchValue({
          partnername: element.partner_company_name,
          projectnumber: element.project_number,
          contact_person: element.email,
          quickdeliverydate: element.prototype_required_date,
          projectname: element.project_name,
          experience: element.project_experience,
          application: element.machine_name,
          sop: element.project_start_date
        })
      });
    });
    if(this.activatedroute.snapshot.queryParamMap.has('data')){
    }
    else{
      this.router.navigate(['/login']);
    }
    this.addFastTrackForm = this.formBuilder.group({
      materials_id: [this.materialid, Validators.required],
      partnername: [{disabled: true}, Validators.required],
      projectnumber: [{disabled: true}, Validators.required],
      contact_person: ['', Validators.required], 
      quickdeliverydate: [{disabled: true}, Validators.required], 
      projectname: [{disabled: true}, Validators.required], 
      experience: [{disabled: true}, Validators.required],
      businesstype: ['', Validators.required],
      application: [{disabled: true}, Validators.required],
      sop: [{disabled: true}, Validators.required],
      company_registered_id: this.Solution_Partner_id,
      sp_id: this.user_id,
      contacts: this.formBuilder.array([this.createContact()]) 
    });
    this.fasttrack = this.activatedroute.snapshot.queryParamMap.getAll('data');
    this.http.get<any>(environment.baseurl+"FillPrototypeDelivery.php?data="+this.fasttrack+"&token="+this.token).subscribe((res: any) =>{
      this.getdynamicdata = res;
      this.addFastTrackForm.setControl('contacts', this.setexistingmat(this.getdynamicdata));
    });
    
    this.contactList = this.addFastTrackForm.get('contacts') as FormArray;
  }
  get f() 
  { 
    return this.addFastTrackForm.controls; 
  }

  setexistingmat(ms: any): FormArray{
    const formarray = new FormArray([]);
    
    ms.forEach((element: any) => {
      formarray.push(this.formBuilder.group({
        material_id: element.material_id,
        part_number: element.part_number,
        description: element.description,
        nettpriceSI_unit1: [' '],
        range_unit1: [' '],
        competition_unit1: [' '],
        expectedrexqty_unit1: [' ']
      }));
    });
    return formarray;
  }

  createContact(): FormGroup {
    return this.formBuilder.group({
      description: [{disabled: true}],
      part_number: [{disabled: true}],
      nettpriceSI_unit1: [' '],
      range_unit1: [' '],
      competition_unit1: [' '],
      expectedrexqty_unit1: [' ']
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
    this.submitted = true;
    if(this.addFastTrackForm.invalid){return  }
    // stop here if form is invalid
    this.http.post<any>(environment.baseurl+"AddFasttrack.php", this.addFastTrackForm.value,{headers: this.httpHeader}).subscribe((res: any) =>{
      if(res.ok == true){
        alert(res.message);
        this.Goback();
      }
    });
  }

  // back to previous page button function

    Goback(){  
      this.materialcmp.td1.length=0;
      this.location.back();
      }
}