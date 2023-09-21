import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-responsible-sales-unit',
  templateUrl: './responsible-sales-unit.component.html',
  styleUrls: ['./responsible-sales-unit.component.scss']
})
export class ResponsibleSalesUnitComponent implements OnInit {
  id:any=''
  getAllCountry:[]=[];
  solution_partner: any=[];
  spCountryList:any;
  modalId:boolean=false;
  editable: boolean = false;
  message: any;
  uniqueCountryList:any =[]
  salesUnitList:any=[]
  updatedData: any[] = [];
  sp_email:any=""
  confirm:string=""
  location: string = '';
  project_name: string = '';
  partner_company_name: string = '';
  machine_name: string = '';
  machine_phase: string = '';
  industry_sector: string = '';
  application: string = '';
  machine_description: string = '';
  toggleBool: boolean = false;
  company_id: string = '';

  showDataAll :boolean = true
  SelectedCountry:string=""
    
  deleteConfirm:any=[]
  delete:boolean=false
  //new variable for add
  submitted = false;
  formValue: any= FormGroup;

  //Pagination
  rowsPerPage: number = 10;
  actualPage: number = 1;
  endPaging: any;
  showProducts: any=[]
  showprevnext: boolean = false;

  @ViewChild('salesUnitForm') form:NgForm | undefined;
  constructor(private httpClient: HttpClient,private formBuilder:FormBuilder) {
    
  }
  ngOnInit(): void {
 // this.onChangeCountry
    this.showDataAll=true
    //Get All Sales Unit List
    //Api call for get All Country list

    this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/getAllCountry.php").subscribe((res: any) =>{
    this.getAllCountry= res
  
    console.log(this.getAllCountry)


  });
    // Sp(solution partner) list   

    this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/getSolutionPartnerInfo.php").subscribe((res: any) =>{
      this.spCountryList = res
      this.pagination()

      this.updateViewAfterPaginationClicked()
     }); 
     this.pagination()

    // here sp= solution partner
    this.formValue = this.formBuilder.group({
      sp_name: ['', Validators.required],
      sp_email: ['', Validators.required],
      sp_location: ['', Validators.required],
    })

  }
  pagination() {
    if (this.salesUnitList.length % this.rowsPerPage != 0) {
      this.endPaging = Math.round(this.salesUnitList.length / this.rowsPerPage)
    
    } else {
      this.endPaging = this.salesUnitList.length / this.rowsPerPage
    }
  }
  onPageChange(value: any) {
    this.showprevnext = false;
    this.actualPage = value;
    this.updateViewAfterPaginationClicked();
  }
  onChangeRowsPerPage(value: any) {
    this.rowsPerPage = value;
    this.pagination();
    this.actualPage = 1;
    this.updateViewAfterPaginationClicked();
  }
  updateViewAfterPaginationClicked() {
    var start = (this.actualPage - 1) * this.rowsPerPage;
    var end = this.actualPage * this.rowsPerPage - 1;
    this.showProducts = this.salesUnitList.slice(start, end);
  }
  prevnext(){
    this.showprevnext = true;
  }

//New function for add data 
OnSubmitNewData(){
  this.submitted = true;
    // stop here if form is invalid
    if (this.formValue.invalid) {
      return;
    }
  this.httpClient.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/addNewResponsibleSalesUnitPerson.php", this.formValue.value).subscribe((res : any) =>{
    if(res.ok === true){
      console.log(res)
      this.modalClose()
 
        this.onChangeCountry( this.formValue.value.sp_location);  

      alert(res.message);   

    }else{
      alert(res.message)
    }
}); 
}

// select country click handler
onChangeCountry(country_id: any){
this.SelectedCountry = country_id;
console.log(country_id)

  if(country_id)
  {
   // this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/demoSalesUnit.php?country="+country_name).subscribe((res: any) =>{
   
    this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/getSolutionPartnerDemo.php?country_id="+country_id).subscribe((res: any) =>{
  
   this.salesUnitList = res
   this.showProducts=res
   console.log(this.salesUnitList)

   //this.showDataAll = false

  });
  }else{  
      
    this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/getSolutionPartnerDemo.php").subscribe((res: any) =>{
    this.salesUnitList = res
    this.pagination()
    this.updateViewAfterPaginationClicked()
    this.showDataAll = true    
  })

  }
}
get f() 
{ 
  return this.formValue.controls; 
}

  //Fetch data for getting registered Solution partner name using country 
  onCountryChange(country_sp: any){
   // console.log(country_sp)
    if(country_sp)
    {
      this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/getSolutionPartnerInfo.php?country="+country_sp).subscribe((res: any) =>{
      this.solution_partner = res;
      console.log(res)
      this.pagination();
      this.updateViewAfterPaginationClicked();
    });
   
    }else{
      this.solution_partner = null;
      console.log('Null')
      console.log('Solution partner',this.solution_partner)
      this.pagination();
      this.updateViewAfterPaginationClicked();
     
    }
  }
 
  //This function will trigger after Edit button click
  save(data: any){
    data.editable = false; 
    this.updatedData.length = 0;
    this.updatedData.push({
      "id":data.id,
      "sdimanager": data.sdimanager,

    });
    console.log(this.updatedData);
   this.httpClient.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/updateResponsibleSalesUnitPersonInfo.php", this.updatedData).subscribe((res : any) =>{
      if(res.ok === true){
        this.message = res.message;
        if(this.showDataAll){
    
          this.ngOnInit()
        }
        this.onChangeCountry( this.SelectedCountry);
        alert('Data update successfully!')      
      }else{
          this.message = res.message;   
          alert('Data update failed!')
      }
    }); 
  }
  // Edit end
onEditClicked(id:any){
  //get Sales unit details based on id
  console.log('Current Sales Unit ',)
  id.editable = true;
  //populate the form based in id
  // this.form?.setValue({})
  //change the button value to update details
}

//Delete Table row  from responsible sales unit table
onDelete(targetModal:any,data:any){
  console.log(data)
}
// This function for deleting row with modal confirmation
deleteRow(){
  this.httpClient.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/removesalesunitcontact.php",this.deleteConfirm ).subscribe((res : any) =>{
  if(res.ok === true){
    this.message = res.message;
    if(this.showDataAll){
      this.ngOnInit()
    }
    this.onChangeCountry( this.SelectedCountry);  
     alert('Data Deleted successfully!')  
  }else{
      this.message = res.message;   
      alert('Data delete failed!')
  }
});
this.deletemodelclose()


}

close(data:any){
  data.editable=false;
}
modalToOpen(){
  $('#createproject').moduleModal('open');
}
modalToOpen1(id:any){
  console.log("click",id)
 $('#tableData').moduleModal('open');
}



modalClose(){
  $('#createproject').moduleModal('close');
} 
modalClose1(){
  $('#tableData').moduleModal('close');
} 
deletemodelclose(){
  $('#opendeletemodel').moduleModal('close');
  $('#messagebox').moduleModal('close');
  $('#delete').moduleModal('close');
}

modalToOpenPopUp(data:any){
  console.log(data)
  this.deleteConfirm=data
  $('#messagebox',).moduleModal('open')
}

modalClosePopUp(){
  $('#messagebox').moduleModal('close')
}



/* pagination function end */
}

