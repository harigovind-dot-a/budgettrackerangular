import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './budget-list.html'
})
export class BudgetList implements OnInit{
  budgets: any[] = [];

  constructor(private router: Router, private api: Api) {}

  ngOnInit() {
    this.loadBudgets();
  }

  getMonthName(monthNumber: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  }
  loadBudgets() {
    this.api.getAllBudgets().subscribe({
      next: (data: any) => {
        this.budgets = data.map((b: any) => ({
          ...b, month: this.getMonthName(b.month)
        }));
      },
      error: (err) => console.error('Failed to load budgets', err)
    });
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
    this.router.navigate(['/budget-add'], { queryParams: { id: budget.id } });
  }

  deleteBudget(budget: any) {
    const confirmed = confirm(`Do you really want to delete this budget?`);
    if (!confirmed) return;
    this.api.deleteBudget(budget.id).subscribe({
      next: () => this.loadBudgets(),
      error: (err) => console.error('Delete failed', err)
    });
  }
}
