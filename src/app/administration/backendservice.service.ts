import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Salesunit } from './models/salesunit';
@Injectable({
  providedIn: 'root'
})
export class BackendserviceService {
  BaseUrl ='https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0';
  constructor(private http: HttpClient, private router: Router) { }

  InserSalesUnit(data : Salesunit): Observable<Salesunit>{
    return this.http.post<Salesunit>(this.BaseUrl + '/InsertSalesUnit.php', {data});
  }
}
