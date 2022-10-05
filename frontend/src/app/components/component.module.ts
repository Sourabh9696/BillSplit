import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRoutingModule } from './component-routing.module';
import {ComponentComponent} from './component.component';
import { UsersComponent } from './users/users.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { FooterComponent } from './shared/footer/footer.component';
import {MaterialModule} from './shared/material.module';
import {ApiCallService} from '../services/api-call.service';
import {CommonService} from '../services/common.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ComponentComponent,
    UsersComponent,
    ExpensesComponent,
    SidenavComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    ComponentRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers:[
    ApiCallService,
    CommonService
  ]
})
export class ComponentModule { }
