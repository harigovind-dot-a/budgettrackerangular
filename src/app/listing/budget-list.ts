import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-budget-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './budget-list.html'
})
export class BudgetList {
  budgets: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadBudgets();
  }

  loadBudgets() {
    this.budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
  }

  toggleMenu(budget: any) {
    this.budgets.forEach(b => b.showMenu = false);
    budget.showMenu = !budget.showMenu;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.card');
    if (!clickedInside) this.budgets.forEach(b => b.showMenu = false);
  }

  editBudget(budget: any) {
    localStorage.setItem('editBudget', JSON.stringify(budget));
    this.router.navigate(['/budget-add']);
  }

  deleteBudget(budget: any) {
    const all = this.budgets.filter(b => b !== budget);
    localStorage.setItem('budgets', JSON.stringify(all));
    this.loadBudgets();
  }
}
