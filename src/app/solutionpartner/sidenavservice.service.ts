import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavserviceService {
  public isExpanded: boolean = false;
  constructor() {
   }

  public expand(){
    this.isExpanded != this.isExpanded;
    return this.isExpanded;
  }
}
