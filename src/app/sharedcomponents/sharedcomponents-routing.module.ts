import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { LoginComponent } from './login/login.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { RequestControlComponent } from './request-control/request-control.component';
import { ThreedmapGlobalComponent } from './threedmap-global/threedmap-global.component';


const routes: Routes = [
  { path: '', children :[
      { path : '', redirectTo : '', pathMatch : 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'disclaimer', component: DisclaimerComponent },
      { path: 'contact', component: ContactComponent},
      { path: 'pagenotfound', component: PagenotfoundComponent},
      { path: 'RequestUser', component: RequestControlComponent}
      // { path: 'forbidden', component: NotFoundComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedcomponentsRoutingModule { }
