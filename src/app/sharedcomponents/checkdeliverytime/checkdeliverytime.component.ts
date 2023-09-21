import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
declare var $: any;
@Component({
  selector: 'app-checkdeliverytime',
  templateUrl: './checkdeliverytime.component.html',
  styleUrls: ['./checkdeliverytime.component.scss']
})
export class CheckdeliverytimeComponent implements OnInit {
  token:any;
  httpHeader: any;
  searchDT: any= FormGroup;
  manual_product: any;
  manual_product_detailed: any;
  manual_product_family: any;
  productss: any;
  delivery_time: any;
  plant_number: any;
  showelchingen: boolean = false;
  showhorb: boolean = false;
  constructor(private LoginserviceService: AfterloginserviceService,private http: HttpClient, private formBuilder: FormBuilder) {
    this.LoginserviceService.userdata().forEach(element => {
      this.token = element.token;

    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
    this.http.get<any>(environment.baseurl+"Manual_product.php?token="+this.token).subscribe((res: any) =>{
        this.manual_product = res;
    });
  }

  ngOnInit() {
    this.searchDT = this.formBuilder.group({
      partnumber: [''],
      description: [''],
      product: [''],
      productdetailed: [''],
      family: ['']
    });
  }
  onchangeproduct(product: any){
    // const products = product.trim();
    this.http.get<any>(environment.baseurl+"manual_product_detailed.php?product="+product+"&token="+this.token).subscribe((res: any) =>{
        this.manual_product_detailed = res;
    });
    this.manual_product_family = null;
  }
  filterPF(pd: any)
  {
    this.http.get<any>(environment.baseurl+"manual_product_family.php?product_family="+pd+"&token="+this.token).subscribe((res: any) =>{
        this.manual_product_family = res;
    });
  }
  deletemodelclose(){
    $('#messagebox').moduleModal('close');
    this.ngOnInit();
  }
  deliverytimeclosemodel(){
    $('#dtnotfoundmodel').moduleModal('close');
    this.ngOnInit();
  }
  Checkdeliverytime(){
    this.http.post<any>(environment.baseurl+"check_delivery_times_2.php", this.searchDT.value,{headers: this.httpHeader}).subscribe((res: any) =>{
        this.productss = res;
        this.delivery_time = JSON.stringify(this.productss[0]['quick_delivery_time']);
        this.delivery_time = this.delivery_time.slice(1, -1)

        if(this.delivery_time == "" || this.delivery_time == null){
          $('#dtnotfoundmodel').moduleModal('open');
        }else{
          // this.plant_number = JSON.stringify(this.productss[0]['plant_number']);
          $('#messagebox').moduleModal('open');
          // if(this.plant_number == "7202"){
          //   this.showelchingen = true;
          // }else{
          //   this.showhorb = true;
          // }
        }
    });
  }
}
