import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-add',
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

  constructor(private router: Router) {}

  ngOnInit() {
    const editData = localStorage.getItem('editBudget');
    if (editData) {
      this.budget = JSON.parse(editData);
      this.isEditMode = true;
    }
  }

  saveBudget() {
    if (!this.budget.month || !this.budget.year || !this.budget.amount) return;

    let budgets = JSON.parse(localStorage.getItem('budgets') || '[]');

    if (this.isEditMode) {
      const old = JSON.parse(localStorage.getItem('editBudget') || '{}');
      budgets = budgets.map((b: any) =>
        b.month === old.month && b.year === old.year ? this.budget : b
      );
      localStorage.removeItem('editBudget');
    } else {
      budgets.push(this.budget);
    }

    localStorage.setItem('budgets', JSON.stringify(budgets));
    this.router.navigate(['/budget-list']);
  }

  goBack() {
    this.router.navigate(['/budget-list']);
  }
}
