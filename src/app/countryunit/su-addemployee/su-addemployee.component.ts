import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Salesunit } from '../../administration/models/salesunit';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
declare var $: any;
@Component({
  selector: 'app-su-addemployee',
  templateUrl: './su-addemployee.component.html',
  styleUrls: ['./su-addemployee.component.scss']
})
export class SuAddemployeeComponent implements OnInit {
  addsalesunituser: any = FormGroup;
  permission: string = '';
  userdata: any;
  token: any;
  emailid: string = '';
  salesunit_id: any;
  showupdate: boolean = false;
  Allempdata: any;
  constructor(private getdata: AfterloginserviceService, private formBuilder: FormBuilder, private router: Router, private http: HttpClient) {
    this.getdata.userdata().forEach(element => {
      this.token = element.token;
      this.emailid = element.email;
      this.salesunit_id = element.userID;
      this.permission = element.permission;
    });
    // console.log(this.token + " " + this.emailid + " " + this.salesunit_id + " " + this.permission);
   }

  ngOnInit(): void {
    // Get all sales_unit employee
    this.http.get<Salesunit>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetSalesUnitEmployee.php").subscribe((res: Salesunit) =>{
      // this.Allempdatails.length = 0;
      // this.Allempdatails.push(res);
      this.Allempdata = res;
    });
    
    // this.http.get<Salesunit>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/checkpermission.php?email="+this.emailid).subscribe((res: any) =>{
    //   res.forEach((element: any) => {
    //     this.permission = element.status
    //   });
    // });
    $('.module-search').moduleSearch();
    $('.module-pagination').modulePagination();

    this.addsalesunituser = this.formBuilder.group({
      role: ['', Validators.required],
      email: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      SalesunitId: this.salesunit_id
  });
  }
  Editdetails(data: any){
    this.showupdate = true;
    this.Allempdata.forEach((element: any) => {
      if(element.su_emp_id === data.su_emp_id){
        this.addsalesunituser.patchValue({
          role: element.role,
          email: element.email,
          firstname: element.firstname,
          lastname: element.lastname
        })
      }
    });
  }
  UpdateEmployeeDetails(){
    // console.log(this.addsalesunituser.value)
    this.http.post<Salesunit>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/updatesalesunitemployee.php", this.addsalesunituser.value).subscribe((res: Salesunit) => {
      if(res.ok === true){
        alert(res.message)
        this.resetform();
        this.ngOnInit();
      }else{
        alert(res.message)
      }
    });
  }
  resetform(){
    this.showupdate = false;
    this.addsalesunituser.reset();
  }
  OnClickSalesUnitEmp(){
    this.http.post<Salesunit>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/addsalesunitemployee.php", this.addsalesunituser.value).subscribe((res: Salesunit) => {
      alert(res.message);
      this.addsalesunituser.reset();
      this.ngOnInit();
    });
  }
}
