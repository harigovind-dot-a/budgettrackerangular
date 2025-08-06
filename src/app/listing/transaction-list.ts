import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-transaction-list',
  imports:[RouterLink, CommonModule],
  templateUrl: './transaction-list.html'
})
export class TransactionList {
  transactions: any[] = [];

  constructor(private router: Router, private api: Api) {}

  ngOnInit() {
    this.api.getAllCategories().subscribe((catList: any) => {
      const categoryMap = new Map<number, string>();
      catList.forEach((c: any) => categoryMap.set(c.id, c.name));

      this.api.getAllTransactions().subscribe((txList: any) => {
        this.transactions = txList.map((tx: any) => {
          const dateObj = new Date(tx.date);

          return {
            ...tx,
            formattedDate: dateObj.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            typeLabel: tx.type === 1 ? 'Income' : 'Expense',
            categoryName: categoryMap.get(tx.category) || 'Unknown'
          };
        });
      });
    });
  }


  loadTransactions() {
    this.api.getAllTransactions().subscribe({
      next: (data: any) => this.transactions = data,
      error: (err) => console.error('Failed to load transactions', err)
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
    this.api.deleteTransaction(tx.id).subscribe({
      next: () => this.loadTransactions(),
      error: (err) => console.error('Delete failed', err)
    });
  }
}
