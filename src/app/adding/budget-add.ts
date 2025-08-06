import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-budget-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-add.html'
})
export class BudgetAdd implements OnInit {
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  budget: any = {
    month: '',
    year: null,
    amount: null
  };

  isEditMode = false;

  constructor(private router: Router, private api: Api, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.isEditMode = true;
        this.api.getBudgets(id).subscribe({
          next: (data: any) => {
            this.budget = {
              id: data.id,
              month: this.months[data.month - 1],
              year: data.year,
              amount: data.amount
            };
          },
          error: err => {
            console.error('Failed to load budget', err);
            this.isEditMode = false;
          }
       });
      }
    });
  }

  saveBudget() {
    if (!this.budget.month || !this.budget.year || !this.budget.amount) return;

    const monthindex = this.months.indexOf(this.budget.month);
    if (monthindex === -1) return;
    const bg = {
      ...this.budget,
      month: monthindex + 1
    };

    if (this.isEditMode && this.budget.id) {
      this.api.updateBudget(this.budget.id, bg).subscribe({
        next: () => {
          this.router.navigate(['/budget-list']);
        },
        error: (err) => console.error('Update Failed', err)
      });
    } else {
      this.api.addBudgets(bg).subscribe({
        next: () => this.router.navigate(['/budget-list']),
        error: (err) => console.error('Add Failed', err)
      });
    }
  }

  goBack() {
    this.router.navigate(['/budget-list']);
  }
}
