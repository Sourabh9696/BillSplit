import { Injectable } from '@angular/core';
import { CommonService } from './common.service';


@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(private commonService: CommonService) { }

  get WindowRef() {
    return window;
  }

  addUser=  (data: any) => this.commonService.doPost('createUser', data);
  getUserDetails = (data: any) => this.commonService.doGet('allUsers', data);
  getUserBalance = (data: any) => this.commonService.doGet('userBalance/'+data.param.id, data);
  getUserExpenses = (data: any) => this.commonService.doGet('userExpenses/'+data.param.id, data);
  getExpenseDetails = (data: any) => this.commonService.doGet('allBills', data);
  getUserContribution =(data: any) => this.commonService.doGet('billContribution/'+data.param.id, data);
  addExpense =  (data: any) => this.commonService.doPost('addExpense', data);
}