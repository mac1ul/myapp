import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from "../material/product";
import { DropdownModel } from '../material/dropdown-model';
declare var $: any;
@Component({
  selector: 'app-threedmap',
  templateUrl: './threedmap.component.html',
  styleUrls: ['./threedmap.component.scss']
})
export class ThreedmapComponent implements OnInit {
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
  showloader: boolean = true;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/iinitial_3dmapvalue.php", {product: "product"}).subscribe((res : any) =>{
      this.fill_product = res;
    });
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/iinitial_3dmapvalue.php", {s3d_model_available: "s3d"}).subscribe((res : any) =>{
      this.fill_model = res;
      // console.log(this.fill_model)
    });
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/iinitial_3dmapvalue.php", {goto_express: "gotoExpress"}).subscribe((res : any) =>{
      this.fill_gotoexpress = res;
    });
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/iinitial_3dmapvalue.php", {product_family: "productFamily"}).subscribe((res : any) =>{
      this.fill_product_family = res;
    });
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/iinitial_3dmapvalue.php", {product_detailed: "productdetailed"}).subscribe((res : any) =>{
      this.fill_product_detailed = res;
    });
  }
  // 3d map update code
  selectedvalues(name: any){
    this.showloader = false;
    if(name === 'products'){
      this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
      product: this.selected_product,
      s3d_model_available: this.selected_model,
      goto_express: this.selected_gotoexpress,
      product_family: '',
      product_detailed: ''
    }).subscribe((res: Product) =>{
      this.assignedvalue(res, name);
      if(res.data.length == 1){
        this.showloader = true;
        alert('No additional data found!')
      }else{
        this.showloader = true;
      }
    });
    }  else if(name == 'productdetailed'){
      this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
      product: this.selected_product,
      s3d_model_available: this.selected_model,
      goto_express: this.selected_gotoexpress,
      product_family: '',
      product_detailed: this.selected_product_detailed
    }).subscribe((res: Product) =>{
      this.assignedvalue(res, name);
      if(res.data.length == 1){
        this.showloader = true;
        alert('No additional data found!')
      }else{
        this.showloader = true;
      }
    });
    }else if(name == 'profuctf'){
      this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
      product: this.selected_product,
      s3d_model_available: this.selected_model,
      goto_express: this.selected_gotoexpress,
      product_family: this.selected_product_family,
      product_detailed: this.selected_product_detailed
    }).subscribe((res: Product) =>{
      this.assignedvalue(res, name);
      if(res.data.length == 1){
        this.showloader = true;
        alert('No additional data found!')
      }else{
        this.showloader = true;
      }
    });
    }else if(name == "models" || name == "gotoe"){
      this.http.post<Product>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/3dmap_filterselectedvalue.php", {
      product: this.selected_product,
      s3d_model_available: this.selected_model,
      goto_express: this.selected_gotoexpress,
      product_family: this.selected_product_family,
      product_detailed: this.selected_product_detailed
    }).subscribe((res: Product) =>{
      this.assignedvalue(res, name);
      if(res.data.length == 1){
        this.showloader = true;
        alert('No additional data found!')
      }else{
        this.showloader = true;
      }
    });
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
    this.pagination();
    this.updateViewAfterPaginationClicked();
    this.anzahl = this.productss.length;
  }
  // Pagination
  pagination() {
    if (this.productss.length % this.rowsPerPage != 0) {
      this.endPaging = Math.round(this.productss.length / this.rowsPerPage) + 1
    } else {
      this.endPaging = this.productss.length / this.rowsPerPage
    }
  }
  onPageChange(value: any) {
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
}
