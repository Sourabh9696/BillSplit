import { Component, TemplateRef, ViewChild, OnInit, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroupDirective, FormGroup, Validators } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { CommonService } from '../../services/common.service';
import Stepper from 'bs-stepper';
declare var $: any;

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  isSubmitted = false;
  private stepper?: Stepper;
  expenseDetailsTable?: boolean;
  ExpenseDetails: any;
  expenseContributionTable?: boolean;
  ExpenseContribution?: null;
  addExpenseForm?: FormGroup;
  splitExpenseForm: FormGroup;
  characterRegex = "^.{6,}$"
  amountRegex = "^\\d+(\\.\\d{1,2})?$"
  UsersDetails: any;
  @ViewChild(FormGroupDirective) formRef!: FormGroupDirective;
  constructor(private fb: FormBuilder, private ApiCallService: ApiCallService, private chRef: ChangeDetectorRef, private commonService: CommonService) {

    //Add Expense Form Group
    this.addExpenseForm = this.fb.group({
      expenseName: ['', [Validators.required, Validators.pattern(this.characterRegex)]],
      expenseDescription: ['', [Validators.required, Validators.pattern(this.characterRegex)]],
      expenseCategory: ['', [Validators.required]],
      expenseAmount: [null, [Validators.required,Validators.pattern(this.amountRegex)]],
      expenseOwnerId: ['', [Validators.required]],
      expenseMembers: ['', [Validators.required]]
    })

    //Split Expense Form Group
    this.splitExpenseForm = this.fb.group({
      expenseMembers: this.fb.array([])
    });
  }

  newSplitExpense(): FormGroup {
    return this.fb.group({
      id: ['', [Validators.required]],
      amount: ['', [Validators.required,Validators.pattern(this.amountRegex)]]
    });
  }

  //get Split Expense Form Array
  get splitexpense(): any {
    return this.splitExpenseForm.get("expenseMembers") as FormArray;
  }

  //Add Split Expense Member
  addSplitExpenseMember() {
    this.splitexpense.push(this.newSplitExpense());
  }
  async ngOnInit() {
    await this.getExpenseDetails();
    await this.getUsersDetails();
    this.stepperInit()
  }

  //get Expense Details List function
  async getExpenseDetails() {
    this.expenseDetailsTable = false;
    return new Promise((resolve, reject) => {
      let dataObj = { data: null, param: null }
      this.ApiCallService.getExpenseDetails(dataObj).subscribe({
        next: (res: any) => {
          if (res.status == "VALID") {
            this.ExpenseDetails = res.responseData;
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

  //get Users Details List function
  async getUsersDetails() {
    return new Promise((resolve, reject) => {
      let dataObj = { data: null, param: null }
      this.ApiCallService.getUserDetails(dataObj).subscribe({
        next: (res: any) => {
          if (res.status == "VALID") {
            this.UsersDetails = res.responseData;
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

  //get Bill contribution function
  async getBillContribution(data: any) {
    this.expenseContributionTable = false;
    this.ExpenseContribution = null;
    return new Promise((resolve, reject) => {
      let dataObj = { data: null, param: { id: data.id } }
      this.ApiCallService.getUserContribution(dataObj).subscribe({
        next: (res: any) => {
          if (res.status == "VALID") {
            this.ExpenseContribution = res.responseData;
            this.openModel('#expenseContributionModel');
            this.expenseContributionTable = true;
            this.chRef.detectChanges();
            this.commonService.DateTable("#expensecontributiontable")
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

  //Stepper Move Next
  next() {
    this.stepper?.next();
  }
  previous() {
    this.stepper?.previous();
  }

  CloseMd()
  {
    this.previous();
    this.addExpenseForm?.reset();
    this.splitExpenseForm.reset(); 
    this.formRef.resetForm();

  }

  //Stepper Initilization
  stepperInit() {
    //Stepper Configuration
    const stepperElement = document.querySelector('#stepper1');
    this.stepper = new Stepper(stepperElement!, {
      linear: false,
      animation: true
    })
  }

  addExpense() {
    this.isSubmitted = true;
    if (!this.addExpenseForm?.valid) {
      return;
    }
    if (this.addExpenseForm.value.expenseMembers.length < 2) {
      this.commonService.showError('Please at least 2 Peoples to split expenses.');
      return;
    }

    //total members in the split expense;
    let members = this.addExpenseForm.value.expenseMembers.length;
    //check how many peoples are selected and add form arrays accordingle
    this.addExpenseForm.value.expenseMembers.forEach((element: any, index: any) => {
      this.addSplitExpenseMember();
      this.splitexpense.at(index).patchValue({
        id: element,
      });
      this.splitexpense.at(index).controls['id'].disable();

      //check if category is equal;
      if (this.addExpenseForm?.value.expenseCategory == "Equal") {
        let totalAmount = Number(this.addExpenseForm.value.expenseAmount)
        let splitAmount = (totalAmount / members).toFixed(2);
        this.splitexpense.at(index).patchValue({
          amount: splitAmount,
        });
        this.splitexpense.at(index).controls['amount'].disable();
      }

    });
    this.next();
  }



  async SplitExpense() {
    let data = this.splitExpenseForm.getRawValue();
    let json;
    if (this.addExpenseForm?.value.expenseCategory == "Percentage") {
      let total = data.expenseMembers.reduce(function (sum: number, amt: any) {
        return (Number(sum) + Number(amt.amount)).toFixed(2);
      }, 0);

      if (total != 100) {
        this.commonService.showError("Please Check the sum amount of percentage is 100 percent. ")
        return;
      }
      let res = await this.calculatePercentage(data.expenseMembers);
      json = {
        "expenseName": this.addExpenseForm?.value.expenseName,
        "expenseDescription": this.addExpenseForm?.value.expenseDescription,
        "expenseCategory": this.addExpenseForm?.value.expenseCategory,
        "expenseAmount": this.addExpenseForm?.value.expenseAmount,
        "expenseOwnerId": this.addExpenseForm?.value.expenseOwnerId,
        "expenseMembers": res
      }
    }

    if (this.addExpenseForm?.value.expenseCategory == "Exact") {
      let total = data.expenseMembers.reduce(function (sum: number, amt: any) {
        return (Number(sum) + Number(amt.amount)).toFixed(2);
      }, 0);
      let sum = Number(this.addExpenseForm?.value.expenseAmount).toFixed(2)
      if (total != sum) {
        this.commonService.showError("Please Check the sum of the total amount. ")
        return;
      }
    }

    if(this.addExpenseForm?.value.expenseCategory == "Exact" || this.addExpenseForm?.value.expenseCategory == "Equal")
    {
      json = {
        "expenseName": this.addExpenseForm?.value.expenseName,
        "expenseDescription": this.addExpenseForm?.value.expenseDescription,
        "expenseCategory": this.addExpenseForm?.value.expenseCategory,
        "expenseAmount": this.addExpenseForm?.value.expenseAmount,
        "expenseOwnerId": this.addExpenseForm?.value.expenseOwnerId,
        "expenseMembers": data.expenseMembers
      }
    }

    let dataObj = { data: json, param: null }
    this.ApiCallService.addExpense(dataObj).subscribe({
      next: (res: any) => {
        if (res.status == "VALID") {
          this.commonService.showSuccess(res.message);
          this.getExpenseDetails();
          this.addExpenseForm?.reset();
          this.splitExpenseForm.reset();
          this.formRef.resetForm();
          this.isSubmitted = false;
          this.closeModel('#addUserModel')
          this.stepperInit();
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    })
  }

  async calculatePercentage(data: any) {
    return new Promise((resolve, reject) => {
      let totalAmount = Number(this.addExpenseForm?.value.expenseAmount);
      let json = []
      for (let i = 0; i <= data.length - 1; i++) {
        let content = { "id": data[i].id, "amount": (totalAmount * data[i].amount / 100).toFixed(2) }
        json.push(content)

      }
      resolve(json)
    })
  }
}
