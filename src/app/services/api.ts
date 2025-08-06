import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseurl = 'http://127.0.0.1:8000/api'

  constructor(private http: HttpClient){}

  getAllBudgets() {
    return this.http.get(`${this.baseurl}/budgets/`);
  }
  getBudgets(id: number){
    return this.http.get(`${this.baseurl}/budgets/${id}/`);
  }
  addBudgets(data : any){
    return this.http.post(`${this.baseurl}/budgets/`, data);
  }
  updateBudget(id: number, data: any){
    return this.http.put(`${this.baseurl}/budgets/${id}/`, data);
  }
  deleteBudget(id: number) {
    return this.http.delete(`${this.baseurl}/budgets/${id}/`);
  }

  getAllTransactions() {
    return this.http.get(`${this.baseurl}/transactions/`);
  }
  getTransactions(id: number) {
    return this.http.get(`${this.baseurl}/transactions/${id}/`);
  }
  addTransaction(data: any) {
    return this.http.post(`${this.baseurl}/transactions/`, data);
  }
  updateTransaction(id: number, data: any) {
    return this.http.put(`${this.baseurl}/transactions/${id}/`, data);
  }
  deleteTransaction(id: number) {
    return this.http.delete(`${this.baseurl}/transactions/${id}/`);
  }

  getAllCategories() {
    return this.http.get(`${this.baseurl}/categories/`);
  }
  getCategory(id: number) {
    return this.http.get(`${this.baseurl}/categories/${id}/`);
  }
  addCategory(data: any) {
    return this.http.post(`${this.baseurl}/categories/`, data);
  }
  updateCategory(id: number, data: any) {
    return this.http.put(`${this.baseurl}/categories/${id}/`, data);
  }
  deleteCategory(id: number) {
    return this.http.delete(`${this.baseurl}/categories/${id}/`);
  }

  getBudgetSummary(month: number, year: number) {
    return this.http.get(`${this.baseurl}/budgets/status/?month=${month}&year=${year}`);
  }

  getAnalytics(month: number, year: number, type: number) {
    return this.http.get(`${this.baseurl}/budgets/analytics/`, {
      params: {
        month: month.toString(),
        year: year.toString(),
        type: type.toString()
      }
    });
  }
}
