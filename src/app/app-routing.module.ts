import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from '../app/sharedcomponents/login/login.component';
import { DisclaimerComponent } from '../app/sharedcomponents/disclaimer/disclaimer.component';
import { ContactComponent } from '../app/sharedcomponents/contact/contact.component';
import { PagenotfoundComponent } from '../app/sharedcomponents/pagenotfound/pagenotfound.component';
import { AdminguardGuard } from './services/adminguard.guard';
import { CheckadminroleGuard } from './services/checkadminrole.guard';
import { ChecksuroleGuard } from './services/checksurole.guard';
import { ChecksproleGuard } from './services/checksprole.guard';
import { RequestControlComponent } from './sharedcomponents/request-control/request-control.component';
const routes: Routes = [
  { path: '', redirectTo : '/login', pathMatch:'full' },
  { path: 'login', component: LoginComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'pagenotfound', component: PagenotfoundComponent},
  { path: 'RequestUser', component: RequestControlComponent},
  { path: 'application', component: AppComponent},
  {
    path: 'admin', data: {roles: ['spm_admin']},
    loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
  },
  {
    path: 'SalesUnitDashboard',  data: {breadcrumb: { skip: true }, roles: ['spm_salesunit']},
    loadChildren: () => import('./countryunit/countryunit.module').then(m => m.CountryunitModule)
  },
  {
    path: 'SPDashboard', data: {breadcrumb: { skip: true }, roles: ['spm_partner']},
    loadChildren: () => import('./solutionpartner/solutionpartner.module').then(m => m.SolutionpartnerModule)
  },
  {
    path: 'sharedComponent', 
    loadChildren: () => import('./sharedcomponents/sharedcomponents.module').then(m => m.SharedcomponentsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
