import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private Router: Router) { }

  ngOnInit(): void {
  }

  configurator(){
    window.open("https://mobilehydraulics.boschrexroth.com/sdi/linklist/tools.html", "_blank");
  }

  myrexroth(){
    window.open("https://www.boschrexroth.com/de/de/myrexroth/", "_blank");
  }
}
