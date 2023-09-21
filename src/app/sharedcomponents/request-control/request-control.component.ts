import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-request-control',
  templateUrl: './request-control.component.html',
  styleUrls: ['./request-control.component.scss']
})
export class RequestControlComponent implements OnInit {
  RequestForm: any= FormGroup;
  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.RequestForm = this.formBuilder.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      city: ['', Validators.required],
      country: [''],
      company_name: [''],
      description: ['', Validators.required]
    });
  }
  SendContactForm(){
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/SendRequest.php", this.RequestForm.value).subscribe((res : any) =>{
        if(res.okay === true){
          alert(res.message);
        }else{
          alert(res.message)
        }
    });
  }
  resetFormdata(){
    this.RequestForm.reset()
  }
}
