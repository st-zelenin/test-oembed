import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandsComponent } from './brands/brands.component';
import { PolicyComponent } from './policy/policy.component';

const routes: Routes = [
  { path: 'policy', component: PolicyComponent },
  { path: '', component: BrandsComponent },
  { path: '**', component: BrandsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
