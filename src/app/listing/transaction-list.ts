import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-transaction-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './transaction-list.html'
})
export class TransactionList {
  transactions: any[] = [];
  categoryMap = new Map<number, string>();
  overBudget: boolean = false;
  selectedMonth: number;
  selectedYear: number;

  constructor(private router: Router, private api: Api) {
    const current = new Date();
    this.selectedMonth = current.getMonth() + 1;
    this.selectedYear = current.getFullYear();
  }

  ngOnInit() {
    this.loadCategoriesAndTransactions();
  }

  loadCategoriesAndTransactions() {
    this.api.getAllCategories().subscribe((catList: any) => {
      this.categoryMap.clear();
      catList.forEach((c: any) => this.categoryMap.set(c.id, c.name));
      this.loadTransactions();
    });
  }

  loadTransactions() {
    this.api.getAllTransactions().subscribe({
      next: (txList: any) => {
        let totalExpense = 0;
        this.transactions = txList.map((tx: any) => {
          const dateObj = new Date(tx.date);
          if (
            tx.type === 2 &&
            dateObj.getMonth() + 1 === this.selectedMonth &&
            dateObj.getFullYear() === this.selectedYear
          ) {
            totalExpense += Number(tx.amount);
          }
          return {
            ...tx,
            formattedDate: dateObj.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            typeLabel: tx.type === 1 ? 'Income' : 'Expense',
            categoryName: this.categoryMap.get(tx.category) || 'Unknown'
          };
        });
        this.checkBudget(totalExpense);
      },
      error: (err) => console.error('Failed to load transactions', err)
    });
  }

  checkBudget(totalExpense: number) {
    this.api.getBudgetSummary(this.selectedMonth, this.selectedYear).subscribe({
      next: (summary: any) => {
        this.overBudget = totalExpense > summary.budget_amount;
      },
      error: () => this.overBudget = false
    });
  }

  toggleMenu(tx: any) {
    this.transactions.forEach(t => t.showMenu = false);
    tx.showMenu = !tx.showMenu;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.card');
    if (!clickedInside) this.transactions.forEach(t => t.showMenu = false);
  }

  editTransaction(tx: any) {
    this.router.navigate(['/transaction-add'], { queryParams: { id: tx.id } });
  }

  deleteTransaction(tx: any) {
    const confirmed = confirm(`Do you really want to delete this transaction?`);
    if (!confirmed) return;
    this.api.deleteTransaction(tx.id).subscribe({
      next: () => this.loadTransactions(),
      error: (err) => console.error('Delete failed', err)
    });
  }
}
