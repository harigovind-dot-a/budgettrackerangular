import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html'
})
export class Landing implements OnInit{
  username = '';
  spendings: Chart | null = null;
  earnings: Chart | null = null;
  summary: any = null;
  overBudget = false;

  constructor(private api: Api){}

  ngOnInit(){
    const current = new Date();
    const month = current.getMonth()+1;
    const year = current.getFullYear();

    this.api.getBudgetSummary(month, year).subscribe({
      next: (data: any) => {
        this.summary = data;
        this.username = data.username;
        this.overBudget = data.expense_total > data.budget_amount;
      },
      error: () => {
        this.summary = null;
        this.overBudget = false;
      }
    });
    this.api.getAnalytics(month, year, 2).subscribe({
      next: (data: any) => {
        if (data.labels?.length) {
          this.spendings = new Chart('spendingChart', {
            type: 'pie',
            data: {
              labels: data.labels,
              datasets: [{
                data: data.data,
                borderWidth: 1
              }]
            }
          });
        } else {
          this.spendings = null;
        }
      }
    });
    this.api.getAnalytics(month, year, 1).subscribe({
      next: (data: any) => {
        if (data.labels?.length) {
          this.earnings = new Chart('earningChart', {
            type: 'pie',
            data: {
              labels: data.labels,
              datasets: [{
                data: data.data,
                borderWidth: 1
              }]
            }
          });
        } else {
          this.earnings = null;
        }
      }
    });
  }
}
