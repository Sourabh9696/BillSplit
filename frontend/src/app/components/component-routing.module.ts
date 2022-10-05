import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentComponent } from './component.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [{

  path: '', component: ComponentComponent, children: [
    {
      path: '',
      redirectTo: 'users',
      pathMatch: 'full'
    },
    {
      path: 'users',
      component: UsersComponent
    },
    {
      path: 'expenses',
      component: ExpensesComponent
    },

  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
