import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './_core/not-found/not-found.component';
import { ListComponent } from './_core/list/list.component';
import { DetailComponent } from './_core/detail/detail.component';


const routes: Routes = [
  { path: 'products', children: [
    { path: ':detail', component: DetailComponent },
    { path: '', component: ListComponent },
  ] },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
