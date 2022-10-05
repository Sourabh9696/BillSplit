import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Injectable()
export class CommonService {
	dataTable: any;
	private baseUrl = environment.backEndUrl;
	headers: any;
	constructor(private router: Router, private toastr: ToastrService, private http: HttpClient) { }

	doPost(url: any, data: any) {

	this.headers = new HttpHeaders({ 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true', 'X-CSRF-Token': 'Fetch', 'Content-Security-Policy': 'upgrade-insecure-requests' });
		return this.http.post<any>(this.baseUrl + url, data.data, { params: data.param, headers: this.headers })
			.pipe(
				map(this.extractData),
				catchError(this.handleErrorObservable)
			)
	}

	doGet(url: any, qp: any) {
		this.headers = new HttpHeaders({ 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true', 'X-CSRF-Token': 'Fetch', 'Content-Security-Policy': 'upgrade-insecure-requests' });
		return this.http.get(this.baseUrl + url, { params: qp.param, headers: this.headers })
			.pipe(
				map(this.extractData),
				catchError(this.handleErrorObservable)
			)
	}

	private extractData(res: Response | any) {
		var body = res
		if (body.result) body = body.result
		return body
	}

	private handleErrorObservable(error: Response | any) {
		console.log("Error",error)
		if (error.json().statusCode === 500) {
			var erroroon = error
			this.showSuccess(erroroon)
			return throwError(() => new Error(error.json().result.error || error))
		} else {
			return throwError(() => new Error(error))
		}
	}

	// Success Toastr
	showSuccess(msg: any) {
		this.toastr.success(msg, "Success!", {
			progressBar: true,
			progressAnimation: "decreasing",
			closeButton: true
		})
	}

	// Error Toastr
	showError(msg: any) {
		this.toastr.error(msg, "Error!", {
			progressBar: true,
			progressAnimation: "decreasing",
			closeButton: true
		})
	}

	// Data Table
	DateTable(data: any) {
		const table: any = $(data);
		this.dataTable = table.DataTable({
			"paging": true,
			"lengthChange": true,
			"searching": true,
			"ordering": true,
			"info": true,
			"autoWidth": false,
			"destroy": true
		})
	}
}
