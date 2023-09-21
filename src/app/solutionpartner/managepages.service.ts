import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ManagepagesService {
  url: any;
  pagecontent: boolean = false;
  projectpagecontent: boolean = false;
  machinepagecontent: boolean = false;
  materialcontentt: boolean = false;
  materialstatus: any;
  ft: boolean = false;
  constructor(private router: Router, private routes : ActivatedRoute) { }

  currenturl(){
    if(this.router.url === "/SPDashboard"){
      this.pagecontent = true;
    }else{
      this.pagecontent = false;
    }
    return this.pagecontent;
  }

  currenturl1(){
    if(this.router.url === "/SPDashboard/Add_project"){
      this.projectpagecontent = true;
    }else{
      this.projectpagecontent = false;
    }
    return this.projectpagecontent;
  }

  currenturl2(param: any){
    // if(this.router.url === "/SPDashboard/Add_project/Add_Machine/"){
    //   this.machinepagecontent = true;
    // }else{
    //   this.machinepagecontent = false;
    // }
    // return this.machinepagecontent;

    const routeParams = "/SPDashboard/Add_project/Add_Machine/"+this.routes.snapshot.paramMap.get('id');
    
    if(this.router.url === param){
      this.machinepagecontent = true;
    }else{
      this.machinepagecontent = false;
    }
    // alert(this.machinepagecontent)
    return this.machinepagecontent;
  }

  currenturl3(){
    // if(this.router.url === "/SPDashboard/Add_project/Add_Machine/Add_Material"){
    //   this.materialcontentt = true;
    // }else{
    //   this.materialcontentt = false;
    // }
    // return this.machinepagecontent = false;
  }

  // onmaterialpage(url: any){
  //   alert(url)
  //   this.materialstatus = url;
  //   if(this.materialstatus === this.router.url){
  //     this.ft = false;
  //     alert(this.ft + 'false')
  //   }else{
  //     this.ft = true;
  //     alert(this.ft + 'true')
  //   }
  //   return this.ft;
  // }
}
