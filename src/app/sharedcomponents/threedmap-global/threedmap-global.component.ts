import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from "../../solutionpartner/material/product";
import { DropdownModel } from '../../solutionpartner/material/dropdown-model';
import { environment } from 'src/environments/environment';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
@Component({
  selector: 'app-threedmap-global',
  templateUrl: './threedmap-global.component.html',
  styleUrls: ['./threedmap-global.component.scss']
})
export class ThreedmapGlobalComponent implements OnInit {
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
  selected_industrysector1: string = '';
  selected_industrysector2: string = '';
  selected_application: string = '';
  // 3D Model
  products: Product[] = [];
  productss: Product[] = [];
  showProducts: Product[] = [];
  anzahl: any;
  rowsPerPage: number = 10;
  actualPage: number = 1;
  showprevnext: boolean = false;
  endPaging: any;
  // store data from 3D map
  updatedData: any[] = [];
  selected_material_number: any;
  selected_typecode: string = '';
  showloader: boolean = true;
  token: any;
  httpHeader: any;
  selected_typecodes: any;
  selected_partnumber: any;
  group1: any;
  group2: any;
  sector_application: any;
  manual_product: any;
  manual_product_detailed: any;
  manual_product_family: any;
  constructor(private http: HttpClient, private getdata: AfterloginserviceService) {
    this.getdata.userdata().forEach(element => {
      this.token = element.token;
     //this.token = localStorage.getItem('Token');
    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
    this.http.post<any>(environment.baseurl + "iinitial_3dmapvalue.php", {product: "product"}, {headers: this.httpHeader}).subscribe((res : any) =>{
      this.fill_product = res;
      // console.log(this.fill_product);
    });
   }

  ngOnInit() {
    this.http.post<any>(environment.baseurl + "iinitial_3dmapvalue.php", {product: "product"}, {headers: this.httpHeader}).subscribe((res : any) =>{
      this.fill_product = res;
      // console.log(this.fill_product);
    });
    this.http.post<any>(environment.baseurl + "iinitial_3dmapvalue.php", {s3d_model_available: "s3d"}, {headers: this.httpHeader}).subscribe((res : any) =>{
      this.fill_model = res;
      // console.log(this.fill_model)
    });
    this.http.post<any>(environment.baseurl + "iinitial_3dmapvalue.php", {goto_express: "gotoExpress"}, {headers: this.httpHeader}).subscribe((res : any) =>{
      this.fill_gotoexpress = res;
    });
    this.http.post<any>(environment.baseurl + "iinitial_3dmapvalue.php", {product_family: "productFamily"}, {headers: this.httpHeader}).subscribe((res : any) =>{
      this.fill_product_family = res;
    });
    this.http.post<any>(environment.baseurl + "iinitial_3dmapvalue.php", {product_detailed: "productdetailed"}, {headers: this.httpHeader}).subscribe((res : any) =>{
      this.fill_product_detailed = res;
    });

    this.http.get<any>(environment.baseurl + "GetIndustrySector.php?token="+ this.token).subscribe((res: any) =>{
      this.group1  = res;
    });
    this.http.get<any>(environment.baseurl+"Manual_product.php?&token="+this.token).subscribe((res: any) =>{
      this.manual_product = res;
    });
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
    //   this.http.post<Product>(environment.baseurl + "3dmap_filterselectedvalue.php", {
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
    //   this.http.post<Product>(environment.baseurl + "3dmap_filterselectedvalue.php", {
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
    //   this.http.post<Product>(environment.baseurl + "3dmap_filterselectedvalue.php", {
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
          this.http.get<any>(environment.baseurl + "3Dmap_searchbypartnumber.php?keyword="+material_number+"&status="+call+"&token="+this.token+"&threedModel="+this.selected_model).subscribe((res: any) =>{
            this.showProducts = res;
          });
        }else{
          this.http.get<any>(environment.baseurl + "3Dmap_searchbypartnumber.php?keyword="+material_number+"&status="+call+"&token="+this.token+"&threedModel="+this.selected_model).subscribe((res: any) =>{
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

  DataSheet(typecode: any){
    var typecode = typecode.replace(/\s/g, "");
    let cutcharacter: any = typecode.substring(0, 3);

    var match: any     = cutcharacter.match(/[a, A]/gi);
    var lastIndex  = cutcharacter.lastIndexOf(match[match.length-1]);
    var lastIndex = lastIndex;

      var splitted = typecode.split("/", 2);
      var find = splitted[0];

      let productfamily: any = find.substring(lastIndex, )

      let skipcharacter: any = lastIndex + 3;

      let cutrestoftc: any = find.substring(skipcharacter, )

      var matchnumber: any     = cutrestoftc.match(/[0-9]/gi);
      var firstIndex  = cutrestoftc.indexOf(matchnumber[0]);

      var firstIndex: any = firstIndex + skipcharacter;

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

  resetForm(){
    this.selected_product = '';
    this.selected_model = '';
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

  requestThreeDModel(){
    alert("Your request has been sent")
  }
}
