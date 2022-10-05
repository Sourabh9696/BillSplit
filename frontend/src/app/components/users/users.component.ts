import { Component, TemplateRef, ViewChild, OnInit, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, FormGroup, Validators } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { CommonService } from '../../services/common.service';
declare var $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  isSubmitted = false;
  userDetailsTable = false;
  UsersDetails: any;
  addUserForm: FormGroup;
  characterRegex = "^.{6,}$"
  contactRegex = "^((\\+91-?)|0)?[0-9]{10}$";
  emailRegex = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  @ViewChild(FormGroupDirective) formRef!: FormGroupDirective;
  expenseDetailsTable: any;
  ExpenseDetails: any;
  balanceDetailsTable: any;
  BalanceDetails: any;
  totalBalance: any;
  constructor(private fb: FormBuilder, private ApiCallService: ApiCallService, private chRef: ChangeDetectorRef, private commonService: CommonService) {
    //Add User Form Group
    this.addUserForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(this.characterRegex)]],
      contact: ['', [Validators.required, Validators.pattern(this.contactRegex)]],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    })
  }

  async ngOnInit() {
    await this.getUsersDetails();
  }

  //get Users Details List function
  async getUsersDetails() {
    this.userDetailsTable = false;
    return new Promise((resolve, reject) => {
      let dataObj = { data: null, param: null }
      this.ApiCallService.getUserDetails(dataObj).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.status == "VALID") {
            this.UsersDetails = res.responseData;
            this.userDetailsTable = true;
            this.chRef.detectChanges();
            this.commonService.DateTable("#userdetailstable")
            resolve(res);
          }
        },
        error: (err: any) => {
          console.error(err);
        },
      })
    })
  }

  //Open Dialog Model
  openModel(data: any) {
    $(data).appendTo("body").modal("show");
  }

  //Close Dialog Model
  closeModel(data: any) {
    $(data).modal("hide");
  }

  //Add User Submit Function
  AddUser() {
    this.isSubmitted = true;
    //check if form is valid
    if (!this.addUserForm.valid) {
      return;
    }
    //Api call service to call the backend api
    let dataObj = { data: this.addUserForm.value, param: null }
    this.ApiCallService.addUser(dataObj).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.status == "VALID") {
          this.commonService.showSuccess(res.message);
          this.getUsersDetails();
          this.addUserForm.reset();
          this.formRef.resetForm();
          this.isSubmitted = false;
          this.closeModel('#addUserModel')
        }
      },
      error: (err: any) => {
        console.error(err);
      },
    })

  }

  //Get the Users Expenses Function
  getUsersExpense(data: any) {
    this.expenseDetailsTable = false;
    this.ExpenseDetails = null;
    return new Promise((resolve, reject) => {
      let dataObj = { data: null, param: { id: data.id } }
      this.ApiCallService.getUserExpenses(dataObj).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.status == "VALID") {
            this.ExpenseDetails = res.responseData;
            this.openModel('#expenseUserModel');
            this.expenseDetailsTable = true;
            this.chRef.detectChanges();
            this.commonService.DateTable("#expensedetailstable")
            resolve(res);
          }
        },
        error: (err: any) => {
          console.error(err);
        },
      })
    })
  }

  //Get Users Balance Funcation
  getUsersBalance(data: any) {
    this.balanceDetailsTable = false;
    this.BalanceDetails = null;
    this.totalBalance = null;
    return new Promise((resolve, reject) => {
      let dataObj = { data: null, param: { id: data.id } }
      this.ApiCallService.getUserBalance(dataObj).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.status == "VALID") {
            this.BalanceDetails = res.responseData;
            this.totalBalance = this.BalanceDetails.reduce(function (sum: number, owe: any) {
              return (Number(sum) + Number(owe.oweAmount)).toFixed(2);
            }, 0);
            this.openModel('#balanceUserModel');
            this.balanceDetailsTable = true;
            this.chRef.detectChanges();
            this.commonService.DateTable("#balancedetailstable")
            resolve(res);
          }
        },
        error: (err: any) => {
          console.error(err);
        },
      })
    })
  }

}
