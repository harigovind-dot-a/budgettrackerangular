import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  imports:[RouterLink, CommonModule],
  templateUrl: './transaction-list.html'
})
export class TransactionList {
  transactions: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
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
    localStorage.setItem('editTransaction', JSON.stringify(tx));
    this.router.navigate(['/transaction-add']);
  }

  deleteTransaction(tx: any) {
    const all = this.transactions.filter(t => t !== tx);
    localStorage.setItem('transactions', JSON.stringify(all));
    this.loadTransactions();
  }
}
