import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../sharedcomponents/login';
import jwt_decode from "jwt-decode";
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BackendservicesService {
  apiURL: string = 'https://rb-mobileweb.de.bosch.com/SPM/backend';
  token: any = localStorage.getItem('Token');
  data: any[] = [];
  constructor(private http: HttpClient) { 
    
  }
  login(email: any):Observable<Login>{
    return this.http.post<Login>(environment.baseurl + '/login.php', email);
  }

  userdata(){
    this.data.length = 0;
    if(this.token !== null){
      let decoded: any = jwt_decode(this.token);
      let user_id: string = decoded['user_id'];
      let company_registered_id: string = decoded['company_registered_id'];
      let role: string = decoded['role'];
      let permission: string = decoded['permission'];
      this.data.push({
        'user_id': user_id,
        'company_registered_id': company_registered_id,
        'role': role,
        'token': this.token,
        'permission': permission
      });
    }
    return this.data; 
  }
}
