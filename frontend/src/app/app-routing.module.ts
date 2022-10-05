import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'component',
    pathMatch: 'full'
},
{
  path:'component',
  loadChildren: () => import('./components/component.module').then(
    module => module.ComponentModule
  )
},
{ path: '**', redirectTo: '/component' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
