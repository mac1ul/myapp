import { Component, OnInit } from '@angular/core';


declare var $: any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
     // $('.module-header').moduleHeader();
     $('.module-header-user-menu').moduleHeaderUserMenu();
     $('.module-header-navigation').moduleHeaderNavigation();
     // If not yet covered by the regular modal initialisation:
     $('.modal-language-select').moduleModal();
     $('.header-extensions .module-header-search').moduleHeaderSearch();
     $('.module-header-meta-navigation').moduleHeaderMetaNavigation();
  }

}
